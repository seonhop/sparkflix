import styled from "styled-components";
import { motion } from "framer-motion";
import { IGetMovieDetailResult } from "../../Interfaces/API/IGetDetails/IGetMovieDetail";
import { OFF_SET } from "../../utils/consts";
import { MovieTvBox, IMovieTvBox } from "./MovieTvBox";
import { SliderButton, ISliderBtnProps } from "./SliderBtn";
import { SliderPages, ISliderPages } from "./SliderPages";
import { IGetMovieImagesResult } from "../../Interfaces/API/IGetImages";
import { ISliderBtnPos } from "../../Interfaces/Components/ISlider";
import { Cast } from "../../Interfaces/API/IGetCredits";
import { SliderBtnBigMovie } from "./SliderBtn";
import React from "react";
import { makeImagePath } from "../../utils/makePath";
import { NETFLIX_LOGO_URL } from "../../utils/consts";

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

interface IMovieTvContainer {
	index: number;
	dirRight: boolean;
	detailData: IGetMovieDetailResult[];
	handleBoxIndexHover: (index: number) => void;
	imageData: IGetMovieImagesResult[] | undefined;
	sliderType: string;
	hoveredIndex: number;
	onExpandClicked: (movieId: string) => void;
	manipulateIndex: (sliderBtnPos: ISliderBtnPos, maxIndex: number) => void;
	maxIndex: number;
	inBigMovie: boolean;
}

export function MovieTvContainer({
	index,
	dirRight,
	detailData,
	handleBoxIndexHover,
	imageData,
	sliderType,
	hoveredIndex,
	onExpandClicked,
	manipulateIndex,
	maxIndex,
	inBigMovie,
}: IMovieTvContainer) {
	return (
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
							movie={movie}
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
	);
}

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

/* index,
dirRight,
detailData,
handleBoxIndexHover,
imageData,
sliderType,
hoveredIndex,
onExpandClicked,
manipulateIndex,
maxIndex,
inBigMovie, */

interface IContainer {
	index: number;
	dirRight: boolean;
	manipulateIndex: (sliderBtnPos: ISliderBtnPos, maxIndex: number) => void;
	maxIndex: number;
	inBigMovie: boolean;
}

interface ICastContainer extends IContainer {
	movieId: string;
	cast: Cast[];
	offset: number;
	arePages: boolean;
}

export function CastContainer({
	movieId,
	index,
	dirRight,
	cast,
	offset,
	arePages,
	inBigMovie,
	manipulateIndex,
	maxIndex,
}: ICastContainer) {
	return (
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
										src={makeImagePath(each_cast.profile_path, "original")}
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
					<SliderButton
						manipulateIndex={manipulateIndex}
						maxIndex={maxIndex}
						dirRight={dirRight}
						inBigMovie={inBigMovie}
					/>
					<SliderPages maxIndex={maxIndex} index={index} />
				</>
			)}
		</CastCardContainer>
	);
}
