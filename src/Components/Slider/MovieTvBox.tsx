import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../../utils/makePath";
import { IGetMovieDetailResult } from "../../Interfaces/API/IGetDetails/IGetMovieDetail";
import { IGetMovieImagesResult } from "../../Interfaces/API/IGetImages";
import { MidDot } from "../MidDot";
import { formatRating, formatVoteCount, formatTime } from "../../utils/format";
import { Genres } from "../Genres";
import {
	IMovieRecommendsResult,
	ITvRecommendsResult,
} from "../../Interfaces/API/IGetRecommends";

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
		background-image: linear-gradient(to top, #1f1f1f, 5%, transparent);
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
		max-height: 100%;
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
		font-family: "Oswald", sans-serif;
		font-weight: 900;
		text-transform: uppercase;
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
			:hover {
				background-color: ${(props) => props.theme.black.lighter};
			}
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

export interface IMovieTvBox {
	handleBoxIndexHover: (index: number) => void;
	movie: IGetMovieDetailResult;
	imageData: IGetMovieImagesResult[] | undefined;
	sliderType: string;
	hoveredIndex: number;
	onExpandClicked: (movieId: string) => void;
}

function isMovieRecommend(recommend: any): recommend is IMovieRecommendsResult {
	return recommend.hasOwnProperty("title");
}

function isTvRecommend(recommend: any): recommend is ITvRecommendsResult {
	return recommend.hasOwnProperty("name");
}

export function MovieTvBox({
	handleBoxIndexHover,
	movie,
	imageData,
	sliderType,
	hoveredIndex,
	onExpandClicked,
}: IMovieTvBox) {
	return (
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
					src={makeImagePath(movie.backdrop_path || movie.poster_path, "w500")}
				/>
				{imageData?.find((obj) => obj.id === movie.id)?.logos[0] ? (
					<img
						src={makeImagePath(
							imageData.find((obj) => obj.id === movie.id)?.logos[0].file_path,
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
	);
}
