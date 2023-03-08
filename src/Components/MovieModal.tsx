import { AnimatePresence } from "framer-motion";
import {
	useNavigate,
	useMatch,
	PathMatch,
	useOutletContext,
} from "react-router-dom";
import { favMovieDict } from "../favMovies";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { motion, useScroll } from "framer-motion";
import {
	makeImagePath,
	formatRating,
	formatTime,
	getReleaseYear,
	formatGenres,
	NEXFLIX_LOGO_URL,
} from "../utils";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";
import { useQuery } from "react-query";
import { getCredits, getImages, getMovieDetail } from "../api";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { useState, useEffect } from "react";
import { MidDot } from "./MidDot";
import { Cast, IGetCredits } from "../Interfaces/API/IGetCredits";
import React from "react";
import { CastSlider } from "./Slider";

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
	position: absolute;
	width: 60vw;
	left: 0;
	right: 0;
	margin: 0 auto;
	border-radius: 15px;
	background-color: ${(props) => props.theme.black.darker};
	z-index: 999;
	display: flex;
	flex-direction: column;
	gap: 0;
	height: 1500px;
	overflow: auto;
`;

const BigCover = styled.div`
	width: 100%;
	background-size: cover;
	background-position: top center;
	height: 70vh;
	box-shadow: 0 0 30px 20px #1f1f1f;
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

const BigOverview = styled.p`
	color: ${(props) => props.theme.white.lighter};
	line-height: 1.25;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const OverViewWrapper = styled.div`
	padding: 0 40px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	position: absolute;
	top: 40%;
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
	font-size: 24px;
	gap: 8px;
	> div {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 4px;
		> span:first-child {
			color: yellow;
		}
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
`;

const Line = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${(props) => props.theme.black.lighter};
`;

function MovieModal() {
	const { movieImages } = useOutletContext<IMovideModal>();
	const moviePathMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
	console.log(moviePathMatch);
	const clickedMovieId = moviePathMatch?.params.movieId;
	const { data: movieDetailResult } = useQuery<IGetMovieDetailResult>(
		["movieDetailResult", clickedMovieId],
		() => getMovieDetail(Number(clickedMovieId))
	);

	const { data: movieImageResult } = useQuery<IGetImagesResult>(
		["movieImageRsult", clickedMovieId],
		() => getImages(Number(clickedMovieId))
	);
	const { data: movieCreditsResult } = useQuery<IGetCredits>(
		["movieCreditResult", clickedMovieId],
		() => getCredits(Number(clickedMovieId))
	);
	let mainCast = undefined;
	if (movieCreditsResult) {
		mainCast = movieCreditsResult.cast.slice(0, 12);
	}
	const [logoExists, setLogoExists] = useState(false);
	const [movieImagesExists, setMovieImagesExists] = useState(false);

	const clickedMovie = moviePathMatch?.params.movieId && movieDetailResult;
	const { scrollY } = useScroll();
	const navigate = useNavigate();

	const onOverlayClick = () => {
		navigate("/");
	};
	useEffect(() => {
		if (movieImages) {
			setMovieImagesExists(true);
		}
		if (movieImages.find((obj) => obj.id + "" === clickedMovieId)?.logos) {
			setLogoExists(true);
		}
	}, [logoExists, movieImages]);
	const movieImageLogoExist = logoExists && movieImages;
	return (
		<>
			<AnimatePresence>
				{moviePathMatch ? (
					<>
						<Overlay
							onClick={onOverlayClick}
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						/>
						<BigMovie
							style={{ top: scrollY.get() + 40 }}
							layoutId={moviePathMatch?.params.movieId}
						>
							{clickedMovie && (
								<>
									<>
										<BigCover
											style={{
												backgroundImage: `linear-gradient(to top, #1f1f1f, 20%, transparent), url(${makeImagePath(
													clickedMovie.backdrop_path,
													"original"
												)})`,
											}}
										/>
										<BigTitle>
											{logoExists && movieImages ? (
												<img
													src={makeImagePath(
														movieImages?.find(
															(obj) => obj.id + "" === clickedMovieId
														)?.logos?.[0]?.file_path || "",
														"w500"
													)}
												/>
											) : (
												clickedMovie.original_title
											)}
										</BigTitle>
									</>

									<OverViewWrapper>
										<OverviewContainer>
											<InfoContainer>
												<div>
													<span className="material-icons">star</span>
													<span>
														{formatRating(clickedMovie?.vote_average)}
													</span>
												</div>
												<MidDot />
												<span>{formatTime(clickedMovie.runtime || 0)}</span>
											</InfoContainer>
											<BigOverview>{clickedMovie.overview}</BigOverview>
										</OverviewContainer>
										<OverviewContainer>
											<div>
												<span>{"Genres:" + " "}</span>
												<span>
													{formatGenres(clickedMovie.genres)?.map(
														(genre, index) =>
															index !== 0 ? ", " + genre : genre
													)}
												</span>
											</div>
										</OverviewContainer>
										<Line />
										<BigMovieSection>
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
