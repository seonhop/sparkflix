import styled from "styled-components";
import { useQuery } from "react-query";
import { getMovies, getMovieDetail, getImages } from "../api";
import { IGetMoviesResult } from "../Interfaces/API/IGetMovies";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";
import { favMovieIDs, favMovieDict } from "../favMovies";
import {
	Outlet,
	useNavigate,
	useMatch,
	PathMatch,
	useOutletContext,
} from "react-router-dom";
import { OFF_SET, SPIDERMAN_ID } from "../utils";
import { HeroSlider } from "../Components/Slider";
import { dir } from "console";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 200vh;
	overflow-x: hidden;
`;

const Span = styled.span`
	display: block;
	padding: 200px;
`;

const Loader = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 20vh;
`;

const Hero = styled.div<{ bgPhoto: string }>`
	display: flex;
	height: 100vh;
	width: 100%;
	justify-content: center;
	align-items: flex-start;
	flex-direction: column;
	padding: 0 3.5rem;
	gap: 2rem;

	background-image: linear-gradient(to right, #000, rgba(0, 0, 0, 0), #000),
		linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)),
		url(${(props) => props.bgPhoto});
	background-size: cover;
`;

const HeroTitleContainer = styled.div`
	width: 20%;
`;

const HeroTitle = styled.img`
	max-width: 100%;
	max-height: 100%;
`;

const HeroInfoContainer = styled.div`
	display: flex;
`;

const HeroOverview = styled.p`
	font-size: 1.1rem;
	width: 35%;
	line-height: 1.25;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const Slider = styled.div<{ margin: number }>`
	position: relative;
	top: ${(props) => props.margin}px;
`;

type ISliderBtnPos = "left" | "right";

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

const newRowVariants = {
	hidden: {
		x: `calc(${window.outerWidth}px + 0.5rem)`,
	},
	visible: {
		x: 0,
	},
	exit: {
		x: `calc(-${window.outerWidth}px - 0.5rem)`,
	},
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

function Home() {
	const navigate = useNavigate();
	const { data: heroImage, isLoading } = useQuery<IGetImagesResult>(
		["images", "highestRatingMovie"],
		() => getImages(SPIDERMAN_ID)
	);

	//const margin = -window.innerHeight * 0.15;
	const { data: favMovieImages } = useQuery<IGetImagesResult[]>(
		["favMovieImages", favMovieIDs],
		async () => {
			const promises = favMovieIDs.map((favmovie) => getImages(favmovie.id));
			return Promise.all(promises);
		}
	);

	return (
		<Container>
			{isLoading ? (
				<Loader />
			) : (
				favMovieImages && (
					<>
						<Hero
							bgPhoto={makeImagePath(heroImage?.backdrops[0].file_path || "")}
						>
							<HeroTitleContainer>
								<HeroTitle
									src={makeImagePath(heroImage?.logos[0].file_path || "")}
								/>
							</HeroTitleContainer>
						</Hero>
						<HeroSlider heroMovieImages={favMovieImages} />
					</>
				)
			)}
		</Container>
	);
}

export default Home;
