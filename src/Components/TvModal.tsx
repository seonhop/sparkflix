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
import { Endpoint, NETFLIX_LOGO_URL } from "../utils/consts";
import { useQuery } from "react-query";
import {
	getCredits,
	getImages,
	getDetail,
	getRecommends,
	getReviews,
} from "../api";
import { IGetMovieImagesResult } from "../Interfaces/API/IGetImages";
import { useState, useEffect } from "react";
import { MidDot } from "./MidDot";
import { Cast, IGetCredits } from "../Interfaces/API/IGetCredits";
import React from "react";
import { CastSlider, EpisodeSlider, ReviewSlider } from "./Slider/Slider";
import { click } from "@testing-library/user-event/dist/click";
import { IGetReviews } from "../Interfaces/API/IGetReviews";
import {
	IGetRecommendsResults,
	IMovieRecommendsResult,
	ITvRecommendsResult,
} from "../Interfaces/API/IGetRecommends";
import { Slider } from "./Slider/Slider";
import { IGetTvDetailResult } from "../Interfaces/API/IGetDetails/IGetTvDetails";
import { fetchData } from "../api";
import { IGetSeasonDetailResult } from "../Interfaces/API/IGetSeasonDetail";

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

const BigTitle = styled.div<{ id: string }>`
	color: ${(props) => props.theme.white.lighter};
	font-family: ${(props) =>
		Number(props.id) % 3 === 0
			? "Oswald, sans-serif"
			: Number(props.id) % 3 === 1
			? "Russo One, cursive"
			: "Tilt Prism, cursive"};
	font-weight: 900;
	color: ${(props) => props.theme.white.lighter};
	text-transform: ${(props) =>
		Number(props.id) % 2 === 0 ? "capitalize" : "uppercase"};
	text-shadow: ${(props) =>
		Number(props.id) % 4 === 0
			? "1px 1px 2px #333333, 0 0 1em #333333, 0 0 0.2em #333333"
			: Number(props.id) % 4 === 1
			? "2px 2px #558ABB"
			: Number(props.id) % 4 === 2
			? "1px 1px 2px red, 0 0 1em pink, 0 0 0.2em pink"
			: "1px 1px 4px red"};

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
	line-height: 1.5;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	overflow: hidden;
	text-overflow: ellipsis;
	height: 10vh;
`;

const BigOverview = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	font-size: 1rem;
	line-height: 1.5;
	max-height: calc(1.5rem * 6);
	overflow: auto;
	text-overflow: ellipsis;
	span {
		font-size: 1.1 rem;
		font-weight: 600;
	}
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

const EpisodeSectionTitle = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	span:last-child {
		font-size: 1rem;
		font-weight: 400;
	}
`;

const BigMovieSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	height: 40vh;

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
		height: 40vh;
		overflow: hidden;
		border-radius: 8px;

		img {
			border-radius: inherit;
			width: 100%;
			height: 100%;
			object-fit: fit;
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

function isMovieRecommend(recommend: any): recommend is IMovieRecommendsResult {
	return recommend.hasOwnProperty("title");
}

function isTvRecommend(recommend: any): recommend is ITvRecommendsResult {
	return recommend.hasOwnProperty("name");
}

function TvModal() {
	const navigate = useNavigate();
	const onRecommendClick = (tvId: string) => {
		console.log(tvId);
		navigate(`/tv/${tvId}`);
	};
	const moviePathMatch: PathMatch<string> | null = useMatch("/tv/:tvId");
	console.log(moviePathMatch);
	const clickedTvId = moviePathMatch?.params.tvId;
	const { data: tvDetailResult } = useQuery<IGetTvDetailResult>(
		["tvDetailResult", clickedTvId],
		() => fetchData(Endpoint.details, "tv", Number(clickedTvId), "en")
	);

	console.log("detail", tvDetailResult);
	console.log(
		"cropped detail",
		tvDetailResult?.seasons[tvDetailResult?.seasons.length - 1]
	);
	const { data: tvImages } = useQuery<IGetMovieImagesResult>(
		["tvImagesResult", clickedTvId],
		() => fetchData(Endpoint.images, "tv", Number(clickedTvId), "en,cn")
	);
	const totalBackdrops = tvImages?.backdrops.length;

	console.log("images", tvImages);
	const { data: tvRecommends, isLoading: isMovieRecommendsLoading } =
		useQuery<IGetRecommendsResults>(["tvRecommendsResult", clickedTvId], () =>
			fetchData(Endpoint.recommends, "tv", Number(clickedTvId))
		);
	console.log("recommends", tvRecommends);
	const { data: tvReviews, isLoading: isMovieReviewsLoading } =
		useQuery<IGetReviews>(["tvReviewsResult", clickedTvId], () =>
			fetchData(Endpoint.reviews, "tv", Number(clickedTvId))
		);
	console.log("reviews", tvReviews);
	const { data: tvCreditsResult } = useQuery<IGetCredits>(
		["tvCreditResult", clickedTvId],
		() => fetchData(Endpoint.credits, "tv", Number(clickedTvId))
	);
	console.log("tvCredits", tvCreditsResult);
	const lastSeasonNumber =
		tvDetailResult?.seasons?.[tvDetailResult.seasons.length - 1]
			?.season_number ?? 1;

	const { data: tvSeasonData } = useQuery<IGetSeasonDetailResult>(
		["tvEpisodeDetailResult", clickedTvId],
		() =>
			fetchData(
				Endpoint.seasons,
				"tv",
				Number(clickedTvId),
				undefined,
				lastSeasonNumber
			),
		{ enabled: !!tvDetailResult }
	);

	const [latestSeason, setLatestSeason] = useState(1);
	console.log("tvSeasonData", tvSeasonData);
	const latestSeasonData = tvSeasonData?.episodes
		.filter((episode) => episode.overview !== "")
		.slice(-5)
		.reverse();
	let reviews = undefined;
	if (tvReviews && tvReviews.results) {
		reviews = tvReviews.results;
	}

	console.log("credits", tvCreditsResult);
	const [logoExists, setLogoExists] = useState(false);
	const [movieImagesExists, setMovieImagesExists] = useState(false);

	const clickedTv = moviePathMatch?.params.tvId && tvDetailResult;
	console.log("clickedMovie", clickedTv);
	const [mainCast, setMainCast] = useState<Cast[]>([]);
	let newMainCast = undefined;
	if (tvCreditsResult) {
		newMainCast = tvCreditsResult.cast.slice(0, 12);
	}
	const onModalClose = () => {
		navigate("/tv");
	};
	useEffect(() => {
		if (tvImages) {
			setMovieImagesExists(true);
		}
		if (tvImages?.logos) {
			setLogoExists(true);
		}
		if (tvCreditsResult) {
			setMainCast(tvCreditsResult.cast.slice(0, 12));
		}
		if (tvDetailResult) {
			const season =
				tvDetailResult?.seasons[tvDetailResult?.seasons.length - 1]
					.season_number;
			console.log("season", season);
			setLatestSeason(season);
		}
	}, [logoExists, tvImages, tvCreditsResult, tvDetailResult]);
	const movieImageLogoExist = logoExists && tvImages;
	console.log(reviews);
	const sectionHeights = {
		cast: "40vh",
		review: "40vh",
		rec: "40vh",
	};
	console.log(
		"sliced",
		tvSeasonData?.episodes
			.filter((episode) => episode.overview !== "")
			.slice(-5)
			.reverse()
	);

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
							{clickedTv && (
								<>
									<>
										<BigCover>
											<img
												src={makeImagePath(
													clickedTv.backdrop_path || clickedTv.poster_path,
													"original"
												)}
											/>
										</BigCover>
										<BigTitle id={clickedTvId as string}>
											{logoExists && tvImages?.logos?.[0] ? (
												<img
													src={makeMovieLogoPath(
														tvImages?.logos?.[0].file_path,
														"w500"
													)}
												/>
											) : (
												clickedTv.name
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
														{"Since " +
															new Date(clickedTv.first_air_date).getFullYear()}
													</span>
													<span>
														{formatGenres(clickedTv.genres, " / ")}
														{clickedTv.production_countries[0] &&
															`\u00A0\u00A0\u2022\u00A0\u00A0${formatCountry(
																clickedTv.production_countries[0]
															)}`}
													</span>
												</YearGenreCountryContainer>
												<InfoContainer>
													<div>
														<span className="material-icons">star</span>
														<span>
															{formatRating(clickedTv?.vote_average) +
																" " +
																formatVoteCount(clickedTv?.vote_count)}
														</span>
													</div>
													<MidDot />
													<span>
														{clickedTv.number_of_episodes.toLocaleString() +
															" episodes"}
													</span>
												</InfoContainer>
												<BigTagline>
													{clickedTv.tagline
														? clickedTv.tagline
														: mainCast
														? `A ${clickedTv.genres[
																clickedTv.genres.length - 1
														  ].name.toLowerCase()} show ` +
														  (mainCast[0] && mainCast[1]
																? `featuring ${mainCast[0].name}, ${mainCast[1].name} and more`
																: "")
														: clickedTv.name}
												</BigTagline>
											</div>
											<BigOverview>
												{clickedTv.overview ? (
													<>
														<span>Overview</span>
														<p> {clickedTv.overview}</p>
													</>
												) : null}
											</BigOverview>
										</BigMovieHeader>
										<BigMovieSection>
											<Divider />
											<EpisodeSectionTitle>
												<BigMovieSectionTitle>
													Latest Episodes
												</BigMovieSectionTitle>
												<span>{tvSeasonData?.name}</span>
											</EpisodeSectionTitle>

											{latestSeasonData && (
												<EpisodeSlider
													episodes={latestSeasonData}
													tvId={
														clickedTvId
															? clickedTvId
															: new Date().getTime().toString()
													}
													images={tvImages}
												/>
											)}
										</BigMovieSection>
										<BigMovieSection
											style={{ height: mainCast?.length < 3 ? "25vh" : "40vh" }}
										>
											<Divider />

											<BigMovieSectionTitle>Cast/Crew</BigMovieSectionTitle>

											{newMainCast && (
												<CastSlider
													cast={newMainCast}
													movieId={
														clickedTvId
															? clickedTvId
															: new Date().getTime.toString()
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
														clickedTvId
															? clickedTvId
															: new Date().getTime().toString()
													}
												/>
											)}
										</BigMovieSection>
										{tvRecommends?.results &&
											tvRecommends.results.length > 0 && (
												<BigMovieSection>
													<Divider />
													<BigMovieSectionTitle>
														Recommendations
													</BigMovieSectionTitle>
													<RecommendationWrapper>
														{tvRecommends &&
															tvRecommends.results
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
																					recommend.poster_path,
																					"w500"
																				)}
																			/>
																		</div>
																		<RecommendTitleBlock>
																			<h1>
																				{isMovieRecommend(recommend)
																					? recommend.title
																					: recommend.name}
																			</h1>
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
																		<span
																			style={{
																				textTransform: "capitalize",
																				fontSize: "0.8rem",
																			}}
																		>
																			{recommend.media_type === "tv"
																				? recommend.media_type.toUpperCase() +
																				  " Show"
																				: recommend.media_type ?? null}
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

export default TvModal;

/*




*/
