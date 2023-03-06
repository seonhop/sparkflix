import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { OFF_SET, makeImagePath } from "../utils";
import { useNavigate } from "react-router-dom";
import { favMovieDict } from "../favMovies";

const SliderContainer = styled.div<{ margin: number }>`
	position: relative;
	top: ${(props) => props.margin}px;
`;

const Row = styled(motion.div)`
	display: grid;
	gap: 0.5rem;
	grid-template-columns: repeat(6, 1fr);
	position: absolute;
	width: 100%;
	padding: 0 3.5rem;
`;

const rowVariants = {
	hidden: {
		x: `calc(${window.outerWidth}px + 0.5rem)`,
	},
	visible: {
		x: 0,
	},
	exit: {
		x: `calc(-${window.outerWidth}px - 0.5rem)`,
	},
};

const Box = styled(motion.div)`
	height: 150px;
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
			delay: 0.5,
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

	> img:first-child {
		max-width: 100%;
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

interface IHeroSlider {
	margin: number;
	index: number;
	heroMovieImages: IGetImagesResult[];
}

export function HeroSlider({ margin, index, heroMovieImages }: IHeroSlider) {
	const navigate = useNavigate();
	const [leaving, setLeaving] = useState(false);
	const toggleLeaving = () => {
		setLeaving((prev) => !prev);
	};
	const onBoxClicked = (movieId: string) => {
		navigate(`/movies/${movieId}`);
	};
	return (
		<>
			<SliderContainer margin={margin}>
				<AnimatePresence initial={false} onExitComplete={toggleLeaving}>
					<Row
						variants={rowVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						key={index}
						transition={{ type: "tween", duration: 1 }}
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
					</Row>
				</AnimatePresence>
			</SliderContainer>
			;
		</>
	);
}
