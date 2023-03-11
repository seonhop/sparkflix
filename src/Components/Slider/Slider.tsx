import styled from "styled-components";
import { SliderButton } from "./SliderBtn";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { IGetMovieImagesResult } from "../../Interfaces/API/IGetImages";
import { Cast } from "../../Interfaces/API/IGetCredits";
import {
	formatTime,
	formatRating,
	formatGenres,
	formatVoteCount,
	formatAirDate,
} from "../../utils/format";
import { OFF_SET, SLIDER_MARGIN, NETFLIX_LOGO_URL } from "../../utils/consts";
import { makeImagePath, makeAvatarPath } from "../../utils/makePath";

import { useNavigate } from "react-router-dom";
import { favMovieDict } from "../../utils/favMovies";
import { favMovieIDs } from "../../utils/favMovies";
import {
	ISliderBtnPos,
	IHeroSlider,
	ISlider,
} from "../../Interfaces/Components/ISlider";
import { IGetMovieDetailResult } from "../../Interfaces/API/IGetDetails/IGetMovieDetail";

import React from "react";
import { useQuery } from "react-query";
import { IGetVideosResult } from "../../Interfaces/API/IGetVideos";
import { getVideos } from "../../api";
import { MidDot } from "../MidDot";
import { Genres } from "../Genres";
import { ReviewResults } from "../../Interfaces/API/IGetReviews";
import { dir } from "console";
import { MovieTvBox } from "./MovieTvBox";
import { SliderPages } from "./SliderPages";
import { CastContainer, MovieTvContainer } from "./SliderContainers";
import { off } from "process";
import { Episode } from "../../Interfaces/API/IGetSeasonDetail";

const SliderWrapper = styled.div<{ margin?: number }>`
	position: relative;
	top: ${(props) => (props.margin ? props.margin : 0)}px;
`;

// Slider Buttons

const SliderBtn = styled(motion.div)<{ pos: ISliderBtnPos }>`
	opacity: 0;
	background-color: rgba(0, 0, 0, 0.5);
	position: absolute;
	width: 3.5rem;
	height: 120px;
	display: flex;
	left: ${(props) => (props.pos === "left" ? 0 : "none")};
	right: ${(props) => (props.pos === "right" ? 0 : "none")};
	justify-content: center;
	align-items: center;
	font-size: 48px;
	:hover {
		cursor: pointer;
	}
`;

const SliderBtnBigMovie = styled(SliderBtn)`
	top: 4.5vh;
`;

const sliderBtnVariants = {
	hidden: {
		opacity: 0,
		scale: 1,
	},
	hover: {
		scale: 1,
		opacity: 1,
		transition: {
			duaration: 0,
			type: "tween",
		},
	},
};

const SliderBtnIcon = styled(motion.span)``;

const MovieSliderContainer = styled(motion.div)`
	display: grid;
	gap: 0.5rem;
	grid-template-columns: repeat(6, 1fr);
	position: absolute;
	width: 100%;
	padding: 0 3.5rem;
`;

const movieSliderContainerVariants = {
	hidden: (dirRight: boolean) => ({
		x: dirRight
			? `calc(${window.outerWidth}px + 0.5rem)`
			: `calc(-${window.outerWidth}px - 0.5rem)`,
	}),
	visible: {
		x: 0,
	},
	exit: (dirRight: boolean) => ({
		x: dirRight
			? `calc(-${window.outerWidth}px - 0.5rem)`
			: `calc(${window.outerWidth}px + 0.5rem)`,
	}),
	hover: {
		transition: {
			duration: 0,
		},
	},
};

const Box = styled(motion.div)`
	display: flex;
	flex-direction: column;
	gap: 0;
	background-color: ${(props) => props.theme.black.darker};
	:first-child {
		transform-origin: center left;
	}
	:last-child {
		transform-origin: center right;
	}
	:hover {
		cursor: pointer;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 30px;
	}
`;

const BoxImgContainer = styled(motion.div)<{
	bgphoto?: string;
	pos: (string | number)[] | string;
	transform: (string | number)[];
	logowidth: string;
}>`
	position: relative;
	background-size: cover;
	background-position: center center;
	height: 120px;
	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(to top, #1f1f1f, 1%, transparent);
	}

	> img:first-child {
		max-height: 100%;
	}
	> img:last-child {
		position: absolute;
		top: ${(props) => props.pos[0]}l;
		right: ${(props) => props.pos[1]};
		bottom: ${(props) => props.pos[2]};
		left: ${(props) => props.pos[3]};
		width: ${(props) => props.logowidth};
		max-height: 40%;
		transform: translate(
			${(props) => props.transform[0]},
			${(props) => props.transform[1]}
		);
	}
	> h2 {
		position: absolute;
		bottom: 2vh;
		left: 2vh;
		font-size: 2vh;
		width: 40%;
	}
`;

const Info = styled(motion.div)`
	padding: 1rem;
	background-color: ${(props) => props.theme.black.darker};
	opacity: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	position: relative;
	h4 {
		text-align: center;
		font-size: 18px;
	}
	> div:first-child {
		display: flex;
		justify-content: space-between;

		> span {
			display: block;
			border-radius: 50%;
			border: 1px solid ${(props) => props.theme.white.lighter};
			padding: 8px;
			font-size: 18px;
			size: 50%;
		}
	}
	> div:nth-child(2) {
		display: flex;
		align-items: center;
		> div {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 4px;
			> span:first-child {
				font-size: 18px;
				color: yellow;
			}
		}
	}
	> div:last-child {
		display: flex;
		width: 100%;
		gap: 4px;
		font-size: 0.9rem;
	}
`;
const infoVariants = {
	visible: {
		opacity: 0,
	},
	hover: {
		opacity: 1,
		scale: 0.9,
		transition: {
			delay: 0.5,
			duaration: 0.3,
			type: "tween",
		},
	},
	exit: {
		zIndex: 1,
	},
};

function InfoPopup({
	isHovered,
	movie,
	onExpandClicked,
}: {
	isHovered: boolean;
	movie: IGetMovieDetailResult;
	onExpandClicked: (movieId: string) => void;
}) {
	return (
		<Info variants={infoVariants}>
			<div>
				<span className="material-icons-outlined">favorite_border</span>
				<span
					className="material-icons"
					onClick={() => onExpandClicked(movie.id + "")}
				>
					expand_more
				</span>
			</div>
			<div>
				<div>
					<span className="material-icons">star</span>
					<span>
						{formatRating(movie?.vote_average) +
							" " +
							formatVoteCount(movie?.vote_count)}
					</span>
				</div>
				<MidDot />
				<span>{formatTime(movie.runtime || 0)}</span>
			</div>
			<div>
				<Genres movie={movie} />
			</div>
		</Info>
	);
}

interface IPaginationProps {
	maxindex: number;
	currindex: number;
	margin: number;
}

const Pagination = styled(motion.div)<IPaginationProps>`
	opacity: 0;
	margin-right: 3.5rem;
	display: grid;
	position: absolute;
	right: 0;
	top: -10px;
	z-index: 10;
	grid-template-columns: repeat(${(props) => props.maxindex + 1}, 1fr);
	grid-gap: 2px;
	> div {
		height: 2px;
		width: 20px;
		background-color: ${(props) => props.theme.black.lighter};
	}
	> div:nth-child(${(props) => props.currindex + 1}) {
		background-color: ${(props) => props.theme.white.darker};
	}
`;

const BigMoviePagination = styled(Pagination)`
	margin-right: 0;
`;

const paginationVariants = {
	hidden: {
		opacity: 0,
	},
	hover: {
		opacity: 1,
		transition: {
			duration: 0.1,
			type: "tween",
		},
	},
	exit: {
		opacity: 0,
		transition: {
			duration: 0,
		},
	},
};

const CastCardContainer = styled(motion.div)`
	display: grid;
	width: 100%;
	grid-template-columns: repeat(2, 1fr);
	position: absolute;
	grid-column-gap: 8px;
	grid-row-gap: 20px;
	img {
		max-width: 100%;
		max-height: 100%;
	}
`;

interface ICastCard {
	pathExists: boolean;
}

const CastCard = styled(motion.div)<ICastCard>`
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
			max-width: ${(props) => (props.pathExists ? "none" : "100%")};
			width: ${(props) => (props.pathExists ? "100%" : "none")};

			height: 100%;
		}
	}
	> div:last-child {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 12px;
		span:first-child {
			font-size: 1rem;
			font-weight: 600;
		}
		span:last-child {
			font-size: 0.8rem;
			color: ${(props) => props.theme.white.darker};
			display: -webkit-box'
		}
	}
`;

interface ICastCardProps {
	name: string;
	character: string;
	image_path: string;
}

interface CastSliderProps {
	cast: Cast[];
	movieId: string;
}

const castSliderContainerVariants = {
	hidden: (dirRight: boolean) => ({
		x: dirRight ? "1000px" : "-1000px",
	}),
	visible: {
		x: 0,
	},
	exit: (dirRight: boolean) => ({
		x: dirRight ? "-1000px" : "1000px",
	}),
	hover: {
		transition: {
			duration: 0,
		},
	},
};

const MotionDiv = styled(motion.div)``;

interface IReviewSliderProps {
	reviews: ReviewResults[];
	movieId: string;
}

const SectionWrapper = styled(motion.div)<{ noData: boolean }>`
	position: absolute;
	width: 100%;
	height: 26vh;
	> div:first-child {
		display: ${(props) => props.noData && "flex"};
		align-items: ${(props) => props.noData && "center"};
		justify-content: ${(props) => props.noData && "center"};
		color: ${(props) => props.noData && props.theme.white.darker};
		border: ${(props) =>
			props.noData && `1px dashed ${props.theme.black.lighter}`};
		height: 100%;
	}
`;

const ReviewCardWrapper = styled(SectionWrapper)<{
	arePages: boolean;
}>`
	display: grid;
	grid-template-columns: ${(props) =>
		props.noData ? `1fr` : `repeat(2, 1fr)`};
	grid-gap: 20px;
`;

const EpisodeContainer = styled(motion.div)`
	display: grid;
	grid-gap: 20px;
	grid-template-columns: 1fr 1.5fr;
	align-self: flex-end;
	height: 100%;
	img {
		max-width: 100%;
		max-height: 100%;
		height: 100%;
		border-radius: 8px;
	}
	> div:last-child {
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
		span {
			color: ${(props) => props.theme.white.darker};
			margin-bottom: 1vh;
		}

		p {
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-height: 1.25;
			-webkit-box-orient: vertical;
			overflow: scroll;
		}
	}
`;

const EpisodeTitleContainer = styled.div`
	max-width: 30vw;
	overflow: hidden;
	text-overflow: ellipsis;

	h1 {
		width: 100%;
		font-weight: 600px;
		font-size: 1.4rem;
		margin-bottom: 3vh;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

const ReviewCard = styled(motion.div)`
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

interface IEpisodeSliderProps {
	episodes: Episode[];
	tvId: string;
	images: IGetMovieImagesResult | undefined;
}

const EpisodeBackdropContainer = styled(motion.div)``;

const EpisodeDetailContainer = styled(motion.div)``;

const sliderVariants = {
	hidden: {},
	visible: {},
	hover: {},
	exot: {},
};

export function EpisodeSlider({ episodes, tvId, images }: IEpisodeSliderProps) {
	const [arePages, setArePages] = useState(true);
	const [noEpisode, setNoReview] = useState(false);
	const [dirRight, setDirRight] = useState(true);
	const [index, setIndex] = useState(0);
	const [backdropIndex, setBackdropIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const toggleLeaving = () => {
		setLeaving((prev) => !prev);
	};
	const totalEpisodes = episodes.length;
	const totalBackdrops = images?.backdrops.length ?? 0;
	const offset = 1;
	const maxIndex = Math.ceil(totalEpisodes / offset) - 1;
	const maxBackdropIndex =
		totalBackdrops - 1 > maxIndex ? maxIndex : totalBackdrops - 1;
	useEffect(() => {
		if (totalEpisodes <= offset) {
			setArePages(false);
		}
		if (totalEpisodes <= 0) {
			setNoReview(true);
		}
		if (totalBackdrops > 1) {
			setBackdropIndex(1);
		}
	}, [arePages, noEpisode, totalBackdrops]);

	const manipulateIndex = (sliderBtnPos: ISliderBtnPos, maxIndex: number) => {
		if (episodes) {
			if (leaving) return;
			toggleLeaving();

			if (sliderBtnPos === "left") {
				setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
				if (totalBackdrops && totalBackdrops !== 0) {
					setBackdropIndex((prev) =>
						prev === 0 ? maxBackdropIndex : prev - 1
					);
				}
				setDirRight(false);
			} else {
				setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
				if (totalBackdrops && totalBackdrops !== 0) {
					setBackdropIndex((prev) =>
						prev === maxBackdropIndex ? 0 : prev + 1
					);
				}
				setDirRight(true);
			}
		}
	};
	console.log(arePages);
	return (
		<>
			<SliderWrapper>
				<AnimatePresence
					initial={false}
					onExitComplete={toggleLeaving}
					custom={dirRight}
				>
					<SectionWrapper
						variants={castSliderContainerVariants}
						initial="hidden"
						animate="visible"
						whileHover="hover"
						exit="exit"
						key={"ep" + tvId + index}
						transition={{ type: "tween", duration: 1 }}
						custom={dirRight}
						noData={noEpisode}
					>
						{noEpisode ? (
							<div> NO EPISODE Available</div>
						) : (
							episodes
								.slice(offset * index, offset * index + offset)
								.map((episode, index) => (
									<EpisodeContainer>
										<div>
											<img
												src={
													episode.still_path
														? makeImagePath(episode.still_path, "original")
														: makeImagePath(
																images?.backdrops[backdropIndex].file_path
														  )
												}
											/>
										</div>
										<div>
											<EpisodeTitleContainer>
												<h1>
													{episode.name !== `Episode ${episode.episode_number}`
														? `EP ${episode.episode_number} | ${episode.name}`
														: `${episode.name}`}
												</h1>
											</EpisodeTitleContainer>

											<span>
												{formatAirDate(new Date(episode.air_date).getTime())
													? formatAirDate(
															new Date(episode.air_date).getTime()
													  ) + " • "
													: ""}
												{formatTime(episode.runtime)}
											</span>
											<p>
												{episode.overview
													? episode.overview
													: "No overview available :("}
											</p>
										</div>
									</EpisodeContainer>
								))
						)}
						{arePages && (
							<>
								{" "}
								<SliderBtnBigMovie
									variants={sliderBtnVariants}
									transition={{ type: "tween" }}
									pos="left"
									onClick={() => manipulateIndex("left", maxIndex)}
								>
									<SliderBtnIcon className="material-icons">
										arrow_back_ios
									</SliderBtnIcon>
								</SliderBtnBigMovie>
								<SliderBtnBigMovie
									variants={sliderBtnVariants}
									transition={{ type: "tween" }}
									pos="right"
									onClick={() => manipulateIndex("right", maxIndex)}
								>
									<SliderBtnIcon className="material-icons">
										arrow_forward_ios
									</SliderBtnIcon>
								</SliderBtnBigMovie>
								<BigMoviePagination
									maxindex={maxIndex}
									currindex={index}
									margin={SLIDER_MARGIN}
									variants={paginationVariants}
								>
									{Array(maxIndex + 1)
										.fill(null)
										.map((_, index) => (
											<div key={index}></div>
										))}
								</BigMoviePagination>
							</>
						)}
					</SectionWrapper>
				</AnimatePresence>
			</SliderWrapper>
		</>
	);
}

export function ReviewSlider({ reviews, movieId }: IReviewSliderProps) {
	const [arePages, setArePages] = useState(true);
	const [noReview, setNoReview] = useState(false);
	const [dirRight, setDirRight] = useState(true);
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const toggleLeaving = () => {
		setLeaving((prev) => !prev);
	};
	const totalReviews = reviews.length;
	const offset = 2;
	const maxIndex = Math.ceil(totalReviews / offset) - 1;
	useEffect(() => {
		if (totalReviews <= offset) {
			setArePages(false);
		}
		if (totalReviews <= 0) {
			setNoReview(true);
		}
	}, [arePages, noReview]);

	const manipulateIndex = (sliderBtnPos: ISliderBtnPos, maxIndex: number) => {
		if (reviews) {
			if (leaving) return;
			toggleLeaving();

			if (sliderBtnPos === "left") {
				setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
				setDirRight(false);
			} else {
				setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
				setDirRight(true);
			}
		}
	};
	console.log(arePages);
	return (
		<>
			<SliderWrapper>
				<AnimatePresence
					initial={false}
					onExitComplete={toggleLeaving}
					custom={dirRight}
				>
					<ReviewCardWrapper
						variants={castSliderContainerVariants}
						initial="hidden"
						animate="visible"
						whileHover="hover"
						exit="exit"
						key={"review" + movieId + index}
						transition={{ type: "tween", duration: 1 }}
						custom={dirRight}
						arePages={arePages}
						noData={noReview}
					>
						{noReview ? (
							<div> No reviews yet</div>
						) : (
							reviews
								.slice(offset * index, offset * index + offset)
								.map((review, index) => (
									<ReviewCard key={index}>
										<div>
											<div>
												<img
													src={makeAvatarPath(
														review.author_details.avatar_path
													)}
												/>
												<span>{review.author}</span>
											</div>
											<div>
												{review.author_details.rating ? (
													<>
														<span className="material-icons">star</span>
														<span>
															{formatRating(review.author_details.rating)}
														</span>
													</>
												) : (
													<span>N/A</span>
												)}
											</div>
										</div>
										<div
											style={{}}
											dangerouslySetInnerHTML={{
												__html: review.content,
											}}
										/>
									</ReviewCard>
								))
						)}
						{arePages && (
							<MotionDiv>
								{" "}
								<SliderBtnBigMovie
									variants={sliderBtnVariants}
									transition={{ type: "tween" }}
									pos="left"
									onClick={() => manipulateIndex("left", maxIndex)}
								>
									<SliderBtnIcon className="material-icons">
										arrow_back_ios
									</SliderBtnIcon>
								</SliderBtnBigMovie>
								<SliderBtnBigMovie
									variants={sliderBtnVariants}
									transition={{ type: "tween" }}
									pos="right"
									onClick={() => manipulateIndex("right", maxIndex)}
								>
									<SliderBtnIcon className="material-icons">
										arrow_forward_ios
									</SliderBtnIcon>
								</SliderBtnBigMovie>
								<BigMoviePagination
									maxindex={maxIndex}
									currindex={index}
									margin={SLIDER_MARGIN}
									variants={paginationVariants}
								>
									{Array(maxIndex + 1)
										.fill(null)
										.map((_, index) => (
											<MotionDiv
												initial={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												key={index}
											></MotionDiv>
										))}
								</BigMoviePagination>
							</MotionDiv>
						)}
					</ReviewCardWrapper>
				</AnimatePresence>
			</SliderWrapper>
		</>
	);
}

export function CastSlider({ cast, movieId }: CastSliderProps) {
	const [dirRight, setDirRight] = useState(true);
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const [arePages, setArePages] = useState(true);

	const toggleLeaving = () => {
		setLeaving((prev) => !prev);
	};
	const totalCast = cast.length;
	const offset = 4;
	const maxIndex = Math.ceil(totalCast / offset) - 1;

	useEffect(() => {
		console.log("maxIndex", maxIndex === 0);
		console.log("totalCast < offset", totalCast < offset);
		if (totalCast <= offset) {
			setArePages(false);
		}
	}, [totalCast, offset]);
	console.log("arePages", arePages);
	const manipulateIndex = (sliderBtnPos: ISliderBtnPos, maxIndex: number) => {
		if (cast) {
			if (leaving) return;
			toggleLeaving();

			if (sliderBtnPos === "left") {
				setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
				setDirRight(false);
			} else {
				setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
				setDirRight(true);
			}
		}
	};

	return (
		<>
			<SliderWrapper>
				<AnimatePresence
					initial={false}
					onExitComplete={toggleLeaving}
					custom={dirRight}
				>
					<CastCardContainer
						variants={castSliderContainerVariants}
						initial="hidden"
						animate="visible"
						whileHover="hover"
						exit="exit"
						key={"cast" + movieId + index}
						transition={{ type: "tween", duration: 1 }}
						custom={dirRight}
					>
						{cast
							?.slice(offset * index, offset * index + offset)
							.map((each_cast, index) => (
								<CastCard
									key={index}
									pathExists={Boolean(each_cast.profile_path)}
								>
									<React.Fragment>
										<MotionDiv>
											<img
												src={makeImagePath(
													each_cast.profile_path,
													"original",
													true
												)}
											/>
										</MotionDiv>

										<MotionDiv>
											<span>{each_cast.name}</span>
											<span>{each_cast.character}</span>
										</MotionDiv>
									</React.Fragment>
								</CastCard>
							))}
						{arePages && (
							<>
								<SliderBtnBigMovie
									variants={sliderBtnVariants}
									transition={{ type: "tween" }}
									pos="left"
									onClick={() => manipulateIndex("left", maxIndex)}
								>
									<SliderBtnIcon className="material-icons">
										arrow_back_ios
									</SliderBtnIcon>
								</SliderBtnBigMovie>
								<SliderBtnBigMovie
									variants={sliderBtnVariants}
									transition={{ type: "tween" }}
									pos="right"
									onClick={() => manipulateIndex("right", maxIndex)}
								>
									<SliderBtnIcon className="material-icons">
										arrow_forward_ios
									</SliderBtnIcon>
								</SliderBtnBigMovie>
								<BigMoviePagination
									maxindex={maxIndex}
									currindex={index}
									margin={SLIDER_MARGIN}
									variants={paginationVariants}
								>
									{Array(maxIndex + 1)
										.fill(null)
										.map((_, index) => (
											<div key={index}></div>
										))}
								</BigMoviePagination>
							</>
						)}
					</CastCardContainer>
				</AnimatePresence>
			</SliderWrapper>
		</>
	);
}

export function Slider({
	imageData,
	detailData,
	wrapperMargin,
	sliderType,
	inBigMovie,
	forCast,
	forReview,
	offset,
	mediaType,
}: ISlider) {
	const navigate = useNavigate();
	const [dirRight, setDirRight] = useState(true);
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const [hoveredIndex, setHoveredIndex] = useState(-1);
	const data = detailData
		? detailData
		: forCast
		? forCast.data
		: forReview?.data || [];
	const sliderOffset = offset ? offset : OFF_SET;
	const [arePages, setArePages] = useState(true);

	useEffect(() => {
		if (maxIndex === 0) {
			setArePages(false);
		}
	}, [arePages]);

	const handleBoxIndexHover = (index: number) => {
		setHoveredIndex(index);
	};
	const toggleLeaving = () => {
		setLeaving((prev) => !prev);
	};
	const onExpandClicked = (id: string) => {
		navigate(`/${mediaType}/${id}`);
	};
	console.log(index);

	const totalData = data.length;
	const maxIndex = detailData
		? Math.floor(totalData / sliderOffset) - 1
		: Math.ceil(totalData / sliderOffset) - 1;
	const manipulateIndex = (sliderBtnPos: ISliderBtnPos, maxIndex: number) => {
		if (imageData || forCast || forReview) {
			if (leaving) return;
			toggleLeaving();

			if (sliderBtnPos === "left") {
				setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
				setDirRight(false);
				console.log(index, dirRight);
			} else {
				setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
				setDirRight(true);
				console.log(index, dirRight);
			}
		}
	};

	return (
		<>
			<SliderWrapper margin={wrapperMargin}>
				<AnimatePresence
					initial={false}
					onExitComplete={toggleLeaving}
					custom={dirRight}
				>
					{detailData && (
						<MovieSliderContainer
							variants={movieSliderContainerVariants}
							initial="hidden"
							animate="visible"
							whileHover="hover"
							exit="exit"
							key={index}
							transition={{ type: "tween", duration: 1 }}
							custom={dirRight}
						>
							{detailData &&
								detailData
									?.slice(OFF_SET * index, OFF_SET * index + OFF_SET)
									.map((movie) => (
										<MovieTvBox
											key={movie.id}
											handleBoxIndexHover={handleBoxIndexHover}
											mediaItem={movie}
											imageData={imageData}
											sliderType={sliderType}
											hoveredIndex={hoveredIndex}
											onExpandClicked={onExpandClicked}
										/>
									))}
							<SliderButton
								manipulateIndex={manipulateIndex}
								maxIndex={maxIndex}
								dirRight={dirRight}
								inBigMovie={inBigMovie}
							/>
							<SliderPages maxIndex={maxIndex} index={index} />
						</MovieSliderContainer>
					)}
				</AnimatePresence>
			</SliderWrapper>
		</>
	);
}
