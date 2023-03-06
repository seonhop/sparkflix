import styled from "styled-components";
import { useQuery } from "react-query";
import { getMovies, getMovieDetail, getImages } from "../api";
import { IGetMoviesResult } from "../Interfaces/API/IGetMovies";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";

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

const Row = styled(motion.div)`
	display: grid;
	gap: 0.5rem;
	grid-template-columns: repeat(6, 1fr);
	position: absolute;
	width: 100%;
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

const Box = styled(motion.div)<{ bgPhoto: string }>`
	background-image: url(${(props) => props.bgPhoto});
	background-size: cover;
	background-position: center center;
	height: 200px;
`;

const SPIDERMAN_ID = 324857;

function Home() {
	const { data: getMoviesResult, isLoading } = useQuery<IGetMoviesResult>(
		["movies", "nowPlaying"],
		getMovies
	);
	console.log("here", getMoviesResult);
	const { data: spidermanResult } = useQuery<IGetMovieDetailResult>(
		["movies", "spiderman-into-the-spiderverse"],
		() => getMovieDetail(SPIDERMAN_ID)
	);

	const { data: heroMovieImages, isLoading: isImagesLoading } =
		useQuery<IGetImagesResult>(
			["images", "highestRatingMovie"],
			() => getImages(SPIDERMAN_ID),
			{
				enabled: !!getMoviesResult?.results, // Only run if getMoviesResult has data
			}
		);

	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const increaseIndex = () => {
		if (getMoviesResult) {
			if (leaving) return;
			toggleLeaving();
			const totalMovies = getMoviesResult.results.length - 1;
			const maxIndex = Math.floor(totalMovies / offset) - 1;
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
		}
	};
	const toggleLeaving = () => {
		setLeaving((prev) => !prev);
	};

	const margin = -window.innerHeight * 0.15;
	const offset = 6;
	console.log(index);
	return (
		<Container>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<Hero
						onClick={increaseIndex}
						bgPhoto={makeImagePath(
							heroMovieImages?.backdrops[0].file_path || ""
						)}
					>
						<HeroTitleContainer>
							<HeroTitle
								src={makeImagePath(heroMovieImages?.logos[0].file_path || "")}
							/>
						</HeroTitleContainer>

						<HeroOverview>{spidermanResult?.overview}</HeroOverview>
					</Hero>
					<Slider margin={margin}>
						<AnimatePresence initial={false} onExitComplete={toggleLeaving}>
							<Row
								variants={rowVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								key={index}
								transition={{ type: "tween", duration: 1 }}
							>
								{getMoviesResult?.results
									.slice(offset * index, offset * index + offset)
									.map((movie) => (
										<Box
											key={movie.id}
											bgPhoto={makeImagePath(movie.backdrop_path || "", "w500")}
										>
											{movie.title}
										</Box>
									))}
							</Row>
						</AnimatePresence>
					</Slider>
				</>
			)}
		</Container>
	);
}

export default Home;
