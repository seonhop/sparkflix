import styled from "styled-components";
import { useQuery } from "react-query";
import {
	getMovies,
	getMovieDetail,
	getImages,
	getPopular,
	getNowPlaying,
} from "../api";
import { IGetMoviesResult } from "../Interfaces/API/IGetMovies";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { makeImagePath } from "../utils/makePath";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";
import { favMovieIDs, favMovieDict } from "../utils/favMovies";
import {
	Outlet,
	useNavigate,
	useMatch,
	PathMatch,
	useOutletContext,
} from "react-router-dom";
import { OFF_SET, HERO_ID as HERO_ID, SLIDER_MARGIN } from "../utils/consts";
import { HeroSlider, Slider } from "../Components/Slider/Slider";
import { dir } from "console";
import { IGetResult } from "../Interfaces/API/IGetResults";
import { useQueryParams } from "../utils/utils";
import { heroDataParams } from "../utils/dataParams";
import {
	nowPlayingDataParams,
	topRatedDataParams,
	popularDataParams,
} from "../utils/dataParams/homeDataParams";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	width: 100%;
	min-height: 200vh;
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

	background-image: linear-gradient(to top, #000000, 5%, transparent),
		linear-gradient(to bottom, #0c0c0c, 15%, transparent),
		url(${(props) => props.bgPhoto});
	background-size: cover;
	box-shadow: 0 0 40px 20px black;
`;

//linear-gradient(to right, #000, rgba(0, 0, 0, 0), #000),

const HeroTitleContainer = styled.div`
	width: 20%;
`;

const HeroTitle = styled.img`
	max-width: 100%;
	max-height: 100%;
`;

const Section = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	h1 {
		font-size: 1.4rem;
		font-weight: 500;
		padding: 0 3.5rem;
		z-index: 2;
	}
	margin-top: 25vh;
`;

function Home() {
	const navigate = useNavigate();
	const onHeroClick = () => {
		navigate(`/movies/${HERO_ID}`);
	};
	const [isDoneLoading, setIsDoneLoading] = useState(false);
	const { data: heroImage, isLoading: heroImageLoading } =
		useQuery<IGetImagesResult>(["heroImage", HERO_ID], () =>
			getImages(HERO_ID)
		);

	const {
		images: favImages,
		details: favDetails,
		isLoading: isHeroLoading,
	} = useQueryParams({
		...heroDataParams,
	});
	const {
		images: nowPlayingImages,
		details: nowPlayingDetails,
		isLoading: isNowPlayingLoading,
	} = useQueryParams({
		...nowPlayingDataParams,
	});
	const {
		images: topRatedImages,
		details: topRatedDetails,
		isLoading: isTopRatedLoading,
	} = useQueryParams({
		...topRatedDataParams,
	});
	const {
		images: popularImages,
		details: popularDetails,
		isLoading: isPopularLoading,
	} = useQueryParams({
		...popularDataParams,
	});

	useEffect(() => {
		setIsDoneLoading(
			!isHeroLoading ||
				!isNowPlayingLoading ||
				!isTopRatedLoading ||
				!isPopularLoading
		);
	}, [isHeroLoading, isNowPlayingLoading, isTopRatedLoading, isPopularLoading]);
	return (
		<Container>
			{heroImageLoading && !isDoneLoading ? (
				<Loader />
			) : (
				favImages &&
				favDetails && (
					<>
						<Hero
							bgPhoto={makeImagePath(heroImage?.backdrops[0].file_path || "")}
							onClick={onHeroClick}
						>
							<HeroTitleContainer>
								<HeroTitle
									src={makeImagePath(heroImage?.logos[0].file_path || "")}
								/>
							</HeroTitleContainer>
						</Hero>
						<HeroSlider
							heroMovieImages={favImages}
							heroMovieDetails={favDetails}
						/>

						<>
							<Section>
								<h1>Popular</h1>
								{popularImages && popularDetails && (
									<Slider
										imageData={popularImages}
										detailData={popularDetails}
										sliderType="popular"
									/>
								)}
							</Section>
							<Section>
								<h1>Now Playing</h1>
								{nowPlayingImages && nowPlayingDetails && (
									<Slider
										imageData={nowPlayingImages}
										detailData={nowPlayingDetails}
										sliderType="nowPlaying"
									/>
								)}
							</Section>
							<Section>
								<h1>Top Rated</h1>
								{topRatedDetails && topRatedImages && (
									<Slider
										imageData={topRatedImages}
										detailData={topRatedDetails}
										sliderType="topRated"
									/>
								)}
							</Section>
						</>

						<Outlet />
					</>
				)
			)}
		</Container>
	);
}

export default Home;
