import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { Cast } from "../Interfaces/API/IGetCredits";
import {
	OFF_SET,
	makeImagePath,
	SLIDER_MARGIN,
	formatTime,
	formatRating,
	formatGenres,
	NETFLIX_LOGO_URL,
} from "../utils";
import { useNavigate } from "react-router-dom";
import { favMovieDict } from "../favMovies";
import { favMovieIDs } from "../favMovies";
import {
	ISliderBtnPos,
	IHeroSlider,
	ISlider,
} from "../Interfaces/Components/Slider";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";
import React from "react";
import { useQuery } from "react-query";
import { IGetVideosResult } from "../Interfaces/API/IGetVideos";
import { getVideos } from "../api";
import { MidDot } from "./MidDot";
import { Genres } from "./Genres";

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
		box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px,
			rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px,
			rgba(0, 0, 0, 0.07) 0px 16px 16px;
	}
`;

const boxVariants = {
	normal: {
		scale: 1,
		transitionEnd: { zIndex: 1 },
		zIndex: 1,
	},
	hover: {
		zIndex: 2,
		scale: 1.3,
		y: -100,
		transition: {
			delay: 1,
			duration: 0.1,
			type: "tween",
		},
	},
};

const BoxImgContainer = styled(motion.div)<{
	bgphoto?: string;
	pos: (string | number)[];
	transform: (string | number)[];
	logowidth: string;
}>`
	position: relative;
	background-size: cover;
	background-position: center center;
	height: 120px;

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
		transform: translate(
			${(props) => props.transform[0]},
			${(props) => props.transform[1]}
		);
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
	hidden: {
		opacity: 1,
	},
	hover: {
		opacity: 1,
		scale: 0.9,
		transition: {
			duaration: 0.1,
			type: "tween",
		},
	},
};

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

export function CastSlider({ cast, movieId }: CastSliderProps) {
	const [dirRight, setDirRight] = useState(true);
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const toggleLeaving = () => {
		setLeaving((prev) => !prev);
	};
	const totalCast = cast.length;
	const offset = 4;
	const maxIndex = Math.floor(totalCast / offset) - 1;
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
					</CastCardContainer>
				</AnimatePresence>
			</SliderWrapper>
		</>
	);
}

export function Slider({ imageData, detailData, wrapperMargin }: ISlider) {
	const navigate = useNavigate();
	const [dirRight, setDirRight] = useState(true);
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const [isMyComponentVisible, setIsMyComponentVisible] = useState(false);

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
						{detailData
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
										{imageData.find((obj) => obj.id === movie.id)?.logos[0]
											.file_path ? (
											<img
												src={makeImagePath(
													imageData.find((obj) => obj.id === movie.id)?.logos[0]
														.file_path || "",
													"w500"
												)}
											/>
										) : (
											<h1>{favMovieDict[String(movie.id)].title}</h1>
										)}
									</BoxImgContainer>

									<Info variants={infoVariants}>
										<div>
											<span className="material-icons-outlined">
												favorite_border
											</span>
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
												<span>{formatRating(movie?.vote_average)}</span>
											</div>
											<MidDot />
											<span>{formatTime(movie.runtime || 0)}</span>
										</div>
										<div>
											<Genres movie={movie} />
										</div>
									</Info>
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
	console.log(heroMovieVideos);

	const onBoxClicked = (movieId: string) => {
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

									<Info variants={infoVariants}>
										<div>
											<span className="material-icons-outlined">
												favorite_border
											</span>
											<span
												className="material-icons"
												onClick={() => onBoxClicked(movie.id + "")}
											>
												expand_more
											</span>
										</div>
										<div>
											<div>
												<span className="material-icons">star</span>
												<span>{formatRating(movie?.vote_average)}</span>
											</div>
											<MidDot />
											<span>{formatTime(movie.runtime || 0)}</span>
										</div>
										<div>
											<Genres movie={movie} />
										</div>
									</Info>
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
