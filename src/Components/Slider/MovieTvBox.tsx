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
import {
	IGetSearchResults,
	SearchResult,
} from "../../Interfaces/API/IGetSearchResults";

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
		zIndex: 999,
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
	titleLen: number;
}>`
	position: relative;
	background-image: url(src);
	background-size: cover;
	background-position: center center;
	height: 120px;
	overflow: hidden;

	> img:first-child {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
	div {
		width: 60%;
		height: 50%;
		position: absolute;
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
		bottom: 0;
		left: 0;
		transform: translate(2vh, -2vh);
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
	color: ${(props) => props.theme.white.darker};
	font-size: 0.8 rem;
`;

function InfoPopup({
	mediaType,
	isHovered,
	mediaItem,
	onExpandClicked,
	hasRating,
	path,
}: {
	isHovered: boolean;
	mediaType: string;
	mediaItem: IGetMovieDetailResult | IGetTvDetailResult | SearchResult;
	onExpandClicked: (id: string, mediaType: string, path?: string) => void;
	hasRating: boolean;
	path?: string;
}) {
	console.log(
		"mediaItem genre_ids",
		!isMovieDetail(mediaItem) && !isTvDetail(mediaItem)
			? mediaItem?.genre_ids
			: null
	);

	return (
		<Info variants={infoVariants}>
			<div>
				<span className="material-icons-outlined">favorite_border</span>
				<span
					className="material-icons"
					onClick={() => onExpandClicked(mediaItem.id + "", mediaType, path)}
				>
					expand_more
				</span>
			</div>
			<InfoBlock>
				<div>
					<span
						className="material-icons"
						style={{ color: hasRating ? "yellow" : "inherit" }}
					>
						star
					</span>
					<span style={{ color: hasRating ? "white" : "inherit" }}>
						{formatRating(mediaItem?.vote_average)}
					</span>
				</div>
				{(isMovieDetail(mediaItem) && mediaItem.runtime) ||
				(isTvDetail(mediaItem) && mediaItem.number_of_episodes) ? (
					<MidDot />
				) : null}

				<span>
					{isMovieDetail(mediaItem)
						? formatTime(mediaItem.runtime)
						: isTvDetail(mediaItem) && mediaItem.number_of_episodes
						? mediaItem.number_of_episodes.toLocaleString() + " episodes"
						: null}
				</span>
			</InfoBlock>
			<div>
				<Genres mediaItem={mediaItem} />
			</div>
		</Info>
	);
}

export interface IMovieTvBox {
	handleBoxIndexHover: (index: number) => void;
	mediaItem: IGetMovieDetailResult | IGetTvDetailResult | SearchResult;
	imageData: IGetMovieImagesResult[] | undefined;
	sliderType: string;
	hoveredIndex: number;
	mediaType: string;
	onExpandClicked: (id: string, mediaType: string, path?: string) => void;
	path?: string;
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
	mediaType,
	path,
}: IMovieTvBox) {
	console.log(
		"hasrating",
		mediaItem.vote_count,
		!isTvDetail(mediaItem) && !isMovieDetail(mediaItem)
			? mediaItem.name
				? mediaItem.name
				: mediaItem.title
			: "never mind"
	);
	const titleLen = isMovieDetail(mediaItem)
		? mediaItem.title.length
		: isTvDetail(mediaItem)
		? mediaItem.name.length
		: (mediaItem.name && mediaItem.name.length) ||
		  (mediaItem.title && mediaItem.title.length) ||
		  0;
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
				titleLen={titleLen}
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
					mediaType={mediaType}
					hasRating={mediaItem.vote_count !== 0}
					path={path}
				/>
			</AnimatePresence>
		</Box>
	);
}
