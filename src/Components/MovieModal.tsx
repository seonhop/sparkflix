import { AnimatePresence } from "framer-motion";
import {
	useNavigate,
	useMatch,
	PathMatch,
	useOutletContext,
} from "react-router-dom";
import { favMovieDict } from "../utils/favMovies";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { motion, useScroll } from "framer-motion";
import {
	formatRating,
	formatTime,
	formatCountry,
	formatGenres,
	formatVoteCount,
} from "../utils/format";
import {
	makeImagePath,
	makeAvatarPath,
	makeMovieLogoPath,
} from "../utils/makePath";
import { NETFLIX_LOGO_URL } from "../utils/consts";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";
import { useQuery } from "react-query";
import {
	getCredits,
	getImages,
	getMovieDetail,
	getRecommends,
	getReviews,
} from "../api";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { useState, useEffect } from "react";
import { MidDot } from "./MidDot";
import { Cast, IGetCredits } from "../Interfaces/API/IGetCredits";
import React from "react";
import { CastSlider, ReviewSlider } from "./Slider";
import { click } from "@testing-library/user-event/dist/click";
import { IGetReviews } from "../Interfaces/API/IGetReviews";
import { IGetRecommendsResults } from "../Interfaces/API/IGetRecommends";

const GlobalStyle = createGlobalStyle`
  html{overflow: hidden;}
`;

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
	z-index: 99;
`;

const BigMovie = styled(motion.div)`
	position: fixed;
	top: 5vh;
	z-index: 999;

	width: 60vw;
	left: 0;
	right: 0;
	margin: 0 auto;
	border-radius: 15px;
	background-color: ${(props) => props.theme.black.darker};
	display: flex;
	flex-direction: column;
	gap: 0;
	height: 90vh;
	overflow-y: scroll;
`;

const BigCover = styled.div`
	width: 100%;
	background-size: cover;
	background-position: top center;
	height: 60vh;
	position: relative;
	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(to top, #1f1f1f, 20%, transparent);
	}

	box-shadow: 0 0 30px 20px #1f1f1f;
	img {
		object-fit: cover;
		object-position: center 20%;
		width: 100%;
		height: 100%;
	}
`;

const BigTitle = styled.div`
	color: ${(props) => props.theme.white.lighter};
	width: 40%;
	padding: 40px;
	font-size: 46px;
	position: relative;
	transform: translateY(-100%);

	> img {
		max-width: 100%;
		max-height: 100%;
	}
`;

const BigTagline = styled.div`
	color: ${(props) => props.theme.white.lighter};
	font-size: 120%;
	font-weight: 600;
	line-height: 1.25;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	overflow: hidden;
	text-overflow: ellipsis;
	height: 10vh;
`;

const BigOverview = styled.div`
	font-size: 1rem;
	line-height: 1.5;
	max-height: calc(1.5rem * 6);
	overflow: auto;
	text-overflow: ellipsis;
`;

const OverViewWrapper = styled.div`
	padding: 0 40px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	position: absolute;
	top: 65vh;
	min-height: 100vh;
	width: 100%;
`;

const OverviewContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	color: ${(props) => props.theme.white.lighter};
	:last-child {
		font-size: 16px;
		gap: 12px;
		> div {
			display: flex;
			gap: 4px;
			align-items: flex-start;
		}
		span:nth-child(odd) {
			color: ${(props) => props.theme.white.darker};
			font-size: 14px;
		}
		span:nth-child(even) {
			line-height: 1.25;
			vertical-align: top;
		}
	}
`;

const InfoContainer = styled.div`
	display: flex;
	align-items: center;
	font-size: 20px;
	gap: 4px;
	> div {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 4px;
		> span:first-child {
			color: yellow;
			font-size: 18px;
		}
	}
`;

const YearGenreCountryContainer = styled.div`
	display: flex;
	font-size: 0.9rem;
	gap: 12px;
	align-items: center;
	color: ${(props) => props.theme.white.darker};
	span:first-child {
		display: inline-block;
		padding: 4px 8px;
		border: 1px solid ${(props) => props.theme.black.lighter};

		border-radius: 4px;
	}
`;

interface IMovideModal {
	movieImages: IGetImagesResult[];
}

const CastCardWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(3, 1fr);

	grid-column-gap: 8px;
	grid-row-gap: 20px;
	img {
		max-width: 100%;
		max-height: 100%;
	}
`;

const CastCardContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 3fr;
	grid-gap: 12px;
	> div:first-child {
		width: 80px;
		height: 80px;
		border-radius: 8px;
		background-color: black;
		background-size: cover;

		> img {
			object-fit: cover;
			object-position: center 20%;
			border-radius: inherit;
			width: 100%;
			height: 100%;
		}
	}
	> div:last-child {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 12px;
		span:first-child {
			font-size: 1.2rem;
			font-weight: 600;
		}
		span:last-child {
			font-size: 0.8rem;
			color: ${(props) => props.theme.white.darker};
		}
	}
`;

interface ICastCardProps {
	name: string;
	character: string;
	image_path: string;
}

const BigMovieSectionTitle = styled.span`
	font-size: 1.8rem;
	font-weight: 600;
`;

const BigMovieSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	height: 40vh;
	max-height: 50vh;

	width: 100%;
	position: relative;
	:first-child {
		height: 25vh;
		gap: 12px;
		div:nth-child(3) {
			margin-top: 12px;
		}
	}
`;

const BigMovieHeader = styled.div`
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	@media screen and (max-width: 768px) {
		grid-template-columns: 1.2fr 1fr; /* for tablet screens */
	}

	@media screen and (max-width: 480px) {
		grid-template-columns: 1fr; /* for mobile screens */
	}
	grid-gap: 20px;
	height: 27vh;
	> div:first-child {
		display: flex;
		flex-direction: column;
		gap: 12px;
		div:last-child {
			margin-top: 12px;
		}
	}
`;

const Divider = styled.div`
	width: 100%;
	height: 1px;
	position: absolute;
	top: -30px;
	background-color: ${(props) => props.theme.black.lighter};
`;

const CloseBtn = styled.span`
	display: block;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.8);
	color: white;
	font-size: 24px;
	position: fixed;
	top: 7vh;
	z-index: 999999;
	right: 21vw;
	padding: 8px;
	:hover {
		cursor: pointer;
	}
`;

const ReviewCardWrapper = styled.div`
	width: 100%;
	height: 26vh;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 20px;
`;

const ReviewCard = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;

	width: 100%;
	gap: 20px;
	background-color: ${(props) => props.theme.black.veryDark};
	padding: 20px;
	div:first-child {
		display: flex;
		align-items: center;
		gap: 12px;
		font-weight: 600;
		justify-content: space-between;
		img {
			width: 35px;
			height: 35px;
			border-radius: 50%;
			object-fit: cover;
			object-position: center;
		}
		div:first-child {
			justify-content: flex-start;
			width: 80%;
			font-size: 100%;
		}
		div:last-child {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 2px 12px;
			gap: 4px;
			border: 1px solid ${(props) => props.theme.white.darker};
			border-radius: 20px;
			span {
				font-size: 14px;
				font-weight: 400;
			}
		}
	}
	div:last-child {
		display: -webkit-box;
		line-height: 1.5;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

const RecommendationWrapper = styled.div`
	display: grid;
	width: 100%;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 20px;
	padding: 0 0 40px 0;
	@media screen and (max-width: 1080px) {
		grid-template-columns: repeat(3, 1fr); /* for tablet screens */
	}

	@media screen and (max-width: 800px) {
		grid-template-columns: repeat(2, 1fr); /* for tablet screens */
	}

	@media screen and (max-width: 100px) {
		grid-template-columns: 1fr; /* for mobile screens */
	}
`;

const Recommendation = styled(motion.div)`
	display: flex;
	flex-direction: column;
	color: ${(props) => props.theme.white.darker};
	font-size: 0.5 rem;
	gap: 4px;
	width: 100%;
	:hover {
		cursor: pointer;
	}

	> div:first-child {
		width: 100%;
		height: 30vh;
		overflow: hidden;
		border-radius: 8px;

		img {
			border-radius: inherit;
			width: 100%;
			height: 100%;
			object-fit: center;
			object-position: center;
		}
	}
`;

const recommendVariants = {
	hover: {
		zIndex: 2,
		scale: 1.02,
		y: -2,
		transition: {
			delay: 0.5,
			duration: 0.1,
			type: "tween",
		},
	},
};

const RecommendTitleBlock = styled.div`
	max-width: 12vw;
	overflow: hidden;
	text-overflow: ellipsis;

	h1 {
		width: 100%;
		color: ${(props) => props.theme.white.lighter};
		font-weight: 700px;
		font-size: 1.1rem;
		padding: 8px 0 2px 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

const RecommendationRating = styled.div`
	display: flex;
	gap: 2px;
	align-items: center;
	span:first-child {
		font-size: 20px;
	}
`;

function MovieModal() {
	const navigate = useNavigate();
	const onRecommendClick = (movieId: string) => navigate(`/movies/${movieId}`);
	const moviePathMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
	console.log(moviePathMatch);
	const clickedMovieId = moviePathMatch?.params.movieId;
	const { data: movieDetailResult } = useQuery<IGetMovieDetailResult>(
		["movieDetailResult", clickedMovieId],
		() => getMovieDetail(Number(clickedMovieId))
	);
	const { data: movieImages } = useQuery<IGetImagesResult>(
		["movieImagesResult", clickedMovieId],
		() => getImages(Number(clickedMovieId))
	);
	const { data: movieRecommends, isLoading: isMovieRecommendsLoading } =
		useQuery<IGetRecommendsResults>(
			["movieRecommendsResult", clickedMovieId],
			() => getRecommends(Number(clickedMovieId))
		);

	const { data: movieReviews, isLoading: isMovieReviewsLoading } =
		useQuery<IGetReviews>(["movieReviewsResult", clickedMovieId], () =>
			getReviews(Number(clickedMovieId))
		);
	const { data: movieCreditsResult } = useQuery<IGetCredits>(
		["movieCreditResult", clickedMovieId],
		() => getCredits(Number(clickedMovieId))
	);
	let mainCast = undefined;
	let reviews = undefined;
	if (movieReviews && movieReviews.results) {
		reviews = movieReviews.results;
	}
	if (movieCreditsResult) {
		mainCast = movieCreditsResult.cast.slice(0, 12);
	}
	const [logoExists, setLogoExists] = useState(false);
	const [movieImagesExists, setMovieImagesExists] = useState(false);

	const clickedMovie = moviePathMatch?.params.movieId && movieDetailResult;
	const { scrollY } = useScroll();

	const onModalClose = () => {
		navigate("/");
	};
	useEffect(() => {
		if (movieImages) {
			setMovieImagesExists(true);
		}
		if (movieImages?.logos) {
			setLogoExists(true);
		}
	}, [logoExists, movieImages]);
	const movieImageLogoExist = logoExists && movieImages;
	console.log(reviews);
	const sectionHeights = {
		cast: "40vh",
		review: "40vh",
		rec: "40vh",
	};
	return (
		<>
			<GlobalStyle />
			<AnimatePresence>
				{moviePathMatch ? (
					<>
						<Overlay
							onClick={onModalClose}
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						/>
						<BigMovie layoutId={moviePathMatch?.params.movieId}>
							{clickedMovie && (
								<>
									<>
										<BigCover>
											<img
												src={makeImagePath(
													clickedMovie.backdrop_path,
													"original"
												)}
											/>
										</BigCover>
										<BigTitle>
											{logoExists && movieImages?.logos?.[0] ? (
												<img
													src={makeMovieLogoPath(
														movieImages?.logos?.[0].file_path,
														"w500"
													)}
												/>
											) : (
												clickedMovie.original_title
											)}
										</BigTitle>
										<CloseBtn className="material-icons" onClick={onModalClose}>
											close
										</CloseBtn>
									</>
									<OverViewWrapper>
										<BigMovieHeader>
											<div>
												<YearGenreCountryContainer>
													<span>
														{new Date(clickedMovie.release_date).getFullYear()}
													</span>
													<span>
														{formatGenres(clickedMovie.genres, " / ")}
														{clickedMovie.production_countries[0] &&
															`\u00A0\u00A0\u2022\u00A0\u00A0${formatCountry(
																clickedMovie.production_countries[0]
															)}`}
													</span>
												</YearGenreCountryContainer>
												<InfoContainer>
													<div>
														<span className="material-icons">star</span>
														<span>
															{formatRating(clickedMovie?.vote_average) +
																" " +
																formatVoteCount(clickedMovie?.vote_count)}
														</span>
													</div>
													<MidDot />
													<span>{formatTime(clickedMovie.runtime || 0)}</span>
												</InfoContainer>
												<BigTagline>
													{clickedMovie.tagline
														? clickedMovie.tagline
														: clickedMovie.title}
												</BigTagline>
											</div>
											<BigOverview>{clickedMovie.overview}</BigOverview>
										</BigMovieHeader>

										<BigMovieSection>
											<Divider />

											<BigMovieSectionTitle>Cast/Crew</BigMovieSectionTitle>

											{mainCast && (
												<CastSlider
													cast={mainCast}
													movieId={
														clickedMovieId
															? clickedMovieId
															: new Date().getTime().toString()
													}
												/>
											)}
										</BigMovieSection>

										<BigMovieSection>
											<Divider />

											<BigMovieSectionTitle>
												Reviews{" "}
												{reviews && reviews.length > 0
													? `(${reviews.length})`
													: null}
											</BigMovieSectionTitle>
											{reviews && (
												<ReviewSlider
													reviews={reviews}
													movieId={
														clickedMovieId
															? clickedMovieId
															: new Date().getTime().toString()
													}
												/>
											)}
										</BigMovieSection>
										{movieRecommends?.results &&
											movieRecommends.results.length > 0 && (
												<BigMovieSection>
													<Divider />
													<BigMovieSectionTitle>
														Recommendations
													</BigMovieSectionTitle>
													<RecommendationWrapper>
														{movieRecommends &&
															movieRecommends.results
																.slice(0, 6)
																.map((recommend, index) => (
																	<Recommendation
																		key={index}
																		variants={recommendVariants}
																		whileHover="hover"
																		onClick={() =>
																			onRecommendClick(recommend.id + "")
																		}
																	>
																		<div>
																			<img
																				src={makeImagePath(
																					recommend.poster_path
																				)}
																			/>
																		</div>
																		<RecommendTitleBlock>
																			<h1>{recommend.title}</h1>
																		</RecommendTitleBlock>
																		<RecommendationRating>
																			<span className="material-icons-round">
																				star
																			</span>
																			<span>
																				{formatRating(recommend.vote_average) +
																					" " +
																					`(${recommend.vote_count.toLocaleString()})`}
																			</span>
																		</RecommendationRating>
																		<span>
																			{recommend.media_type
																				? recommend.media_type
																				: null}
																		</span>
																	</Recommendation>
																))}
													</RecommendationWrapper>
												</BigMovieSection>
											)}
									</OverViewWrapper>
								</>
							)}
						</BigMovie>
					</>
				) : null}
			</AnimatePresence>
		</>
	);
}

export default MovieModal;

/*




*/
