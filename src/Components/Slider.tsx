import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { OFF_SET, makeImagePath, SLIDER_MARGIN } from "../utils";
import { useNavigate } from "react-router-dom";
import { favMovieDict } from "../favMovies";
import { favMovieIDs } from "../favMovies";
import { ISliderBtnPos, IHeroSlider } from "../Interfaces/Components/Slider";

const SliderContainer = styled.div<{ margin: number }>`
	position: relative;
	top: ${(props) => props.margin}px;
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
	},
	hover: {
		opacity: 1,
		transition: {
			duaration: 0,
			type: "tween",
		},
	},
};

const SliderBtnIcon = styled(motion.span)``;

const Row = styled(motion.div)`
	display: grid;
	gap: 0.5rem;
	grid-template-columns: repeat(6, 1fr);
	position: absolute;
	width: 100%;
	padding: 0 3.5rem;
`;

const rowVariants = {
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
	:first-child {
		transform-origin: center left;
	}
	:last-child {
		transform-origin: center right;
	}
	:hover {
		cursor: pointer;
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
		y: -80,
		transition: {
			delay: 1.2,
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
	padding: 10px;
	background-color: ${(props) => props.theme.black.lighter};
	opacity: 0;
	width: 100%;
	h4 {
		text-align: center;
		font-size: 18px;
	}
`;

const infoVariants = {
	hover: {
		opacity: 1,
		transition: {
			delay: 0.5,
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

export function HeroSlider({ heroMovieImages }: IHeroSlider) {
	const navigate = useNavigate();
	const [dirRight, setDirRight] = useState(true);
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
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

	const onBoxClicked = (movieId: string) => {
		navigate(`/movies/${movieId}`);
	};
	console.log(SLIDER_MARGIN);
	return (
		<>
			<SliderContainer margin={SLIDER_MARGIN}>
				<AnimatePresence
					initial={false}
					onExitComplete={toggleLeaving}
					custom={dirRight}
				>
					<Row
						variants={rowVariants}
						initial="hidden"
						animate="visible"
						whileHover="hover"
						exit="exit"
						key={index}
						transition={{ type: "tween", duration: 1 }}
						custom={dirRight}
					>
						{heroMovieImages
							?.slice(OFF_SET * index, OFF_SET * index + OFF_SET)
							.map((movie) => (
								<Box
									variants={boxVariants}
									initial="normal"
									whileHover="hover"
									transition={{ type: "tween" }}
									key={movie.id}
									onClick={() => onBoxClicked(movie.id + "")}
								>
									<BoxImgContainer
										pos={favMovieDict[String(movie.id)].pos}
										transform={favMovieDict[String(movie.id)].transform}
										logowidth={favMovieDict[String(movie.id)].logoWidth}
									>
										<img
											src={makeImagePath(
												movie.backdrops[0].file_path ||
													movie.posters[0].file_path,
												"w500"
											)}
										/>
										{movie.logos[0].file_path ? (
											<img
												src={makeImagePath(movie.logos[0].file_path, "w500")}
											/>
										) : (
											<h1>{favMovieDict[String(movie.id)].title}</h1>
										)}
									</BoxImgContainer>
									<Info variants={infoVariants}>
										<h4>{favMovieDict[String(movie.id)].title}</h4>
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
					</Row>
				</AnimatePresence>
				<AnimatePresence></AnimatePresence>
			</SliderContainer>
		</>
	);
}
