import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { Cast } from "../Interfaces/API/IGetCredits";
import {
	formatTime,
	formatRating,
	formatGenres,
	formatVoteCount,
} from "../utils/format";
import { OFF_SET, SLIDER_MARGIN, NETFLIX_LOGO_URL } from "../utils/consts";
import { makeImagePath, makeAvatarPath } from "../utils/makePath";

import { useNavigate } from "react-router-dom";
import { favMovieDict } from "../favMovies";
import { favMovieIDs } from "../favMovies";
import {
	ISliderBtnPos,
	IHeroSlider,
	ISlider,
} from "../Interfaces/Components/ISlider";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";
import React from "react";
import { useQuery } from "react-query";
import { IGetVideosResult } from "../Interfaces/API/IGetVideos";
import { getVideos } from "../api";
import { MidDot } from "./MidDot";
import { Genres } from "./Genres";
import { ReviewResults } from "../Interfaces/API/IGetReviews";

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
	top: 15%;
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

const boxVariants = {
	normal: {
		zIndex: 1,
		scale: 1,
		opacity: 1,
		transition: { duration: 0.5 },
	},
	hover: {
		scale: 1.2,
		y: -50,
		zIndex: 4,
		transition: {
			delay: 0.3,
			duration: 0.2,
			type: "tween",
		},
	},
	exit: {
		zIndex: 5,
	},
};

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
	hover: {
		opacity: 1,
		scale: 0.9,
		transition: {
			delay: 0.5,
			duaration: 0.3,
			type: "tween",
		},
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
	top: -20px;
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

const CastCard = styled(motion.div)`
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
			font-size: 1rem;
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

const ReviewCardWrapper = styled(motion.div)<{
	arePages: boolean;
	noReview: boolean;
}>`
	position: absolute;
	width: 100%;
	height: 26vh;
	display: grid;
	grid-template-columns: ${(props) =>
		props.noReview ? `1fr` : `repeat(2, 1fr)`};
	grid-gap: 20px;
	div:first-child {
		display: ${(props) => props.noReview && "flex"};
		align-items: ${(props) => props.noReview && "center"};
		justify-content: ${(props) => props.noReview && "center"};
		color: ${(props) => props.noReview && props.theme.white.darker};
		border: ${(props) =>
			props.noReview && `1px dashed ${props.theme.black.lighter}`};
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
						noReview={noReview}
					>
						{noReview ? (
							<div> NO REVIEWS YET</div>
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
	const maxIndex = Math.floor(totalCast / offset) - 1;
	useEffect(() => {
		if (maxIndex === 0) {
			setArePages(false);
		}
	}, [arePages]);
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
								<CastCard key={index}>
									<React.Fragment>
										<MotionDiv>
											{each_cast.profile_path ? (
												<img
													src={makeImagePath(
														each_cast.profile_path,
														"original"
													)}
												/>
											) : (
												<img src={NETFLIX_LOGO_URL} />
											)}
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

interface IMovieLogoPosProps {
	title: string;
	id: number;
	pos: (number | string)[];
	transform: (number | string)[];
	logoWidth: string;
}

export function Slider({
	imageData,
	detailData,
	wrapperMargin,
	sliderType,
}: ISlider) {
	const navigate = useNavigate();
	const [dirRight, setDirRight] = useState(true);
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const [isHovered, setIsHoverd] = useState("");
	const [isMyComponentVisible, setIsMyComponentVisible] = useState(false);
	const [isHoveredMap, setIsHoveredMap] = useState<{ [key: string]: boolean }>(
		{}
	);
	const [hoveredIndex, setHoveredIndex] = useState(-1);

	const handleBoxIndexHover = (index: number) => {
		setHoveredIndex(index);
	};

	// function to handle box hover events
	const handleBoxHover = (movieId: number, isHovered: boolean) => {
		setIsHoveredMap((prevMap) => ({ ...prevMap, [movieId]: isHovered }));
	};
	const toggleLeaving = () => {
		setLeaving((prev) => !prev);
	};

	const onExpandClicked = (movieId: string) => {
		navigate(`/movies/${movieId}`);
	};
	const totalMovies = detailData.length;
	const maxIndex = Math.floor(totalMovies / OFF_SET) - 1;
	const manipulateIndex = (sliderBtnPos: ISliderBtnPos, maxIndex: number) => {
		if (imageData) {
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
			<SliderWrapper margin={wrapperMargin}>
				<AnimatePresence
					initial={false}
					onExitComplete={toggleLeaving}
					custom={dirRight}
				>
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
									<Box
										variants={boxVariants}
										initial="normal"
										whileHover="hover"
										exit="exit"
										transition={{ type: "tween" }}
										key={movie.id}
										layoutId={movie.id + "" + sliderType}
										onMouseEnter={() => handleBoxIndexHover(movie.id)}
										onMouseLeave={() => handleBoxIndexHover(-1)}
									>
										<BoxImgContainer
											pos={["none", "none", 0, 0]}
											transform={["2vh", "-2vh"]}
											logowidth={"35%"}
										>
											<img
												src={makeImagePath(
													movie.backdrop_path || movie.poster_path,
													"w500"
												)}
											/>
											{imageData?.find((obj) => obj.id === movie.id)
												?.logos[0] ? (
												<img
													src={makeImagePath(
														imageData.find((obj) => obj.id === movie.id)
															?.logos[0].file_path,
														"w500"
													)}
												/>
											) : (
												<h2>{movie.title}</h2>
											)}
										</BoxImgContainer>
										<AnimatePresence initial={false}>
											<InfoPopup
												isHovered={hoveredIndex === movie.id}
												movie={movie}
												onExpandClicked={onExpandClicked}
											/>
										</AnimatePresence>
									</Box>
								))}
						<SliderBtn
							variants={sliderBtnVariants}
							transition={{ type: "tween" }}
							pos="left"
							onClick={() => manipulateIndex("left", maxIndex)}
						>
							<SliderBtnIcon className="material-icons">
								arrow_back_ios
							</SliderBtnIcon>
						</SliderBtn>
						<SliderBtn
							variants={sliderBtnVariants}
							transition={{ type: "tween" }}
							pos="right"
							onClick={() => manipulateIndex("right", maxIndex)}
						>
							<SliderBtnIcon className="material-icons">
								arrow_forward_ios
							</SliderBtnIcon>
						</SliderBtn>
						<Pagination
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
						</Pagination>
					</MovieSliderContainer>
				</AnimatePresence>
			</SliderWrapper>
		</>
	);
}

export function HeroSlider({ heroMovieImages, heroMovieDetails }: IHeroSlider) {
	const navigate = useNavigate();
	const [dirRight, setDirRight] = useState(true);
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const [isMovieHovered, setIsMovieHovered] = useState(false);
	const handleMouseEnter = () => {
		setIsMovieHovered(true);
	};

	const handleMouseLeave = () => {
		setIsMovieHovered(false);
	};
	const toggleLeaving = () => {
		setLeaving((prev) => !prev);
	};
	const totalMovies = favMovieIDs.length;
	const maxIndex = Math.floor(totalMovies / OFF_SET) - 1;
	const manipulateIndex = (sliderBtnPos: ISliderBtnPos) => {
		if (heroMovieImages) {
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
	const { data: heroMovieVideos, isLoading: heroVideosLoading } = useQuery<
		IGetVideosResult[]
	>(["heroMovieVideos", favMovieIDs], async () => {
		const promises = heroMovieDetails.map((movie) => getVideos(movie.id));
		return Promise.all(promises);
	});

	const onExpandClicked = (movieId: string) => {
		navigate(`/movies/${movieId}`);
	};

	return (
		<>
			<SliderWrapper margin={SLIDER_MARGIN}>
				<AnimatePresence
					initial={false}
					onExitComplete={toggleLeaving}
					custom={dirRight}
				>
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
						{heroMovieDetails
							?.slice(OFF_SET * index, OFF_SET * index + OFF_SET)
							.map((movie) => (
								<Box
									variants={boxVariants}
									initial="normal"
									whileHover="hover"
									transition={{ type: "tween" }}
									key={movie.id}
									layoutId={movie.id + ""}
								>
									<BoxImgContainer
										pos={favMovieDict[String(movie.id)].pos}
										transform={favMovieDict[String(movie.id)].transform}
										logowidth={favMovieDict[String(movie.id)].logoWidth}
									>
										<img
											src={makeImagePath(
												movie.backdrop_path || movie.poster_path,
												"w500"
											)}
										/>
										{heroMovieImages.find((obj) => obj.id === movie.id)
											?.logos[0].file_path ? (
											<img
												src={makeImagePath(
													heroMovieImages.find((obj) => obj.id === movie.id)
														?.logos[0].file_path || "",
													"w500"
												)}
											/>
										) : (
											<h1>{favMovieDict[String(movie.id)].title}</h1>
										)}
									</BoxImgContainer>
									<InfoPopup
										isHovered={true}
										movie={movie}
										onExpandClicked={onExpandClicked}
									/>
								</Box>
							))}
						<SliderBtn
							variants={sliderBtnVariants}
							transition={{ type: "tween" }}
							pos="left"
							onClick={() => manipulateIndex("left")}
						>
							<SliderBtnIcon className="material-icons">
								arrow_back_ios
							</SliderBtnIcon>
						</SliderBtn>
						<SliderBtn
							variants={sliderBtnVariants}
							transition={{ type: "tween" }}
							pos="right"
							onClick={() => manipulateIndex("right")}
						>
							<SliderBtnIcon className="material-icons">
								arrow_forward_ios
							</SliderBtnIcon>
						</SliderBtn>
						<Pagination
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
						</Pagination>
					</MovieSliderContainer>
				</AnimatePresence>
				<AnimatePresence></AnimatePresence>
			</SliderWrapper>
		</>
	);
}
