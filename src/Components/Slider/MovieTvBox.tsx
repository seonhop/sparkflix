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
import { IGetTvDetailResult } from "../../Interfaces/API/IGetDetails/IGetTvDetails";

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
};

const BoxImgContainer = styled(motion.div)<{
	bgphoto?: string;
	pos: (string | number)[] | string;
	transform: (string | number)[];
	logowidth: string;
	id: string;
	src: string;
	noBackdrop: boolean;
}>`
	position: relative;
	background-image: url(src);
	background-size: cover;
	background-position: center center;
	height: 120px;
	overflow: hidden;

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
		width: 100%;

		object-position: center;
	}
	div {
		width: 75%;
		height: 50%;
		position: absolute;
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
		top: ${(props) => props.pos[0]}l;
		right: ${(props) => props.pos[1]};
		bottom: ${(props) => props.pos[2]};
		left: ${(props) => props.pos[3]};
		transform: translate(
			${(props) => props.transform[0]},
			${(props) => props.transform[1]}
		);
		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
			object-position: left bottom;
		}
	}
	h2 {
		width: 80%;
		font-size: 1.2rem;
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
		align-self: flex-end;
		text-shadow: ${(props) =>
			Number(props.id) % 4 === 0
				? "1px 1px 2px #333333, 0 0 1em #333333, 0 0 0.2em #333333"
				: Number(props.id) % 4 === 1
				? "2px 2px #558ABB"
				: Number(props.id) % 4 === 2
				? "1px 1px 2px red, 0 0 1em pink, 0 0 0.2em pink"
				: "1px 1px 4px red"};
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
		font-size: 0.9rem;
		width: 100%;
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
	active: {
		zIndex: 1,
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
};

const InfoBlock = styled.div`
	font-size: 0.8 rem;
`;

function InfoPopup({
	isHovered,
	mediaItem,
	onExpandClicked,
}: {
	isHovered: boolean;
	mediaItem: IGetMovieDetailResult | IGetTvDetailResult;
	onExpandClicked: (id: string) => void;
}) {
	return (
		<Info variants={infoVariants}>
			<div>
				<span className="material-icons-outlined">favorite_border</span>
				<span
					className="material-icons"
					onClick={() => onExpandClicked(mediaItem.id + "")}
				>
					expand_more
				</span>
			</div>
			<InfoBlock>
				<div>
					<span className="material-icons">star</span>
					<span>{formatRating(mediaItem?.vote_average)}</span>
				</div>
				<MidDot />

				<span>
					{isMovieDetail(mediaItem)
						? formatTime(mediaItem.runtime || 0)
						: mediaItem.number_of_episodes.toLocaleString() + " episodes"}
				</span>
			</InfoBlock>
			<div>
				<Genres movie={mediaItem} />
			</div>
		</Info>
	);
}

export interface IMovieTvBox {
	handleBoxIndexHover: (index: number) => void;
	mediaItem: IGetMovieDetailResult | IGetTvDetailResult;
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

function isMovieDetail(mediaItem: any): mediaItem is IGetMovieDetailResult {
	return mediaItem.hasOwnProperty("title");
}

function isTvDetail(mediaItem: any): mediaItem is IGetTvDetailResult {
	return mediaItem.hasOwnProperty("name");
}

export function MovieTvBox({
	handleBoxIndexHover,
	mediaItem,
	imageData,
	sliderType,
	hoveredIndex,
	onExpandClicked,
}: IMovieTvBox) {
	console.log(
		"backdrop exists",
		mediaItem.id,
		mediaItem,
		!mediaItem.backdrop_path
	);
	return (
		<Box
			variants={boxVariants}
			initial="normal"
			whileHover="hover"
			exit="exit"
			transition={{ type: "tween" }}
			key={mediaItem.id}
			layoutId={mediaItem.id + "" + sliderType}
			onMouseEnter={() => handleBoxIndexHover(mediaItem.id)}
			onMouseLeave={() => handleBoxIndexHover(-1)}
		>
			<BoxImgContainer
				pos={["none", "none", 0, 0]}
				transform={["2vh", "-2vh"]}
				logowidth={"50%"}
				id={mediaItem.id + ""}
				noBackdrop={!mediaItem.backdrop_path}
				src={makeImagePath(
					mediaItem.backdrop_path || mediaItem.poster_path,
					"w500"
				)}
			>
				<img
					src={makeImagePath(mediaItem.backdrop_path || mediaItem.poster_path)}
				/>
				<div>
					{imageData?.find((obj) => obj.id === mediaItem.id)?.logos[0] ? (
						<img
							src={makeImagePath(
								imageData.find((obj) => obj.id === mediaItem.id)?.logos[0]
									.file_path,
								"w500"
							)}
						/>
					) : (
						<h2>
							{isMovieDetail(mediaItem) ? mediaItem.title : mediaItem.name}
						</h2>
					)}
				</div>
			</BoxImgContainer>
			<AnimatePresence initial={false}>
				<InfoPopup
					isHovered={hoveredIndex === mediaItem.id}
					mediaItem={mediaItem}
					onExpandClicked={onExpandClicked}
				/>
			</AnimatePresence>
		</Box>
	);
}
