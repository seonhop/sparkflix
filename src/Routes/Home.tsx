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
import { HeroSlider, Slider } from "../Components/Slider";
import { dir } from "console";
import { IGetResult } from "../Interfaces/API/IGetResults";

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

	const { data: favMovieImages, isLoading: favImageLoading } = useQuery<
		IGetImagesResult[]
	>(["favMovieImages", favMovieIDs], async () => {
		const promises = favMovieIDs.map((favmovie) => getImages(favmovie.id));
		return Promise.all(promises);
	});
	const { data: favMovieDetails, isLoading: favDetailLoading } = useQuery<
		IGetMovieDetailResult[]
	>(["favMovieDetails", favMovieIDs], async () => {
		const promises = favMovieIDs.map((favmovie) => getMovieDetail(favmovie.id));
		return Promise.all(promises);
	});
	const isHeroLoading = heroImageLoading || favImageLoading || favDetailLoading;
	const { data: popularMovies, isLoading: popularMoviesLoading } =
		useQuery<IGetResult>(["popular", "popularMovies"], () => getPopular());
	const { data: popularMovieDetails, isLoading: popMovieDetailLoading } =
		useQuery<IGetMovieDetailResult[]>(
			["popMovieDetails", popularMovies],
			async () => {
				if (!popularMovies) {
					return [];
				}
				const promises =
					popularMovies &&
					popularMovies?.results.map((favmovie) => getMovieDetail(favmovie.id));
				return Promise.all(promises);
			}
		);
	const { data: popularMovieImages, isLoading: popMovieImagesLoading } =
		useQuery<IGetImagesResult[]>(
			["popMovieImages", popularMovies],
			async () => {
				if (!popularMovies) {
					return [];
				}
				const promises =
					popularMovies &&
					popularMovies?.results.map((favmovie) => getImages(favmovie.id));
				return Promise.all(promises);
			}
		);
	const movieImages = favMovieImages ? [...favMovieImages] : [];
	const { data: topRatedMovies } = useQuery<IGetResult>(
		["topRated", "movies"],
		() => getMovies()
	);
	const { data: topRatedDetails, isLoading: topRatedDetailsLoading } = useQuery<
		IGetMovieDetailResult[]
	>(["topRated", "details"], async () => {
		if (!topRatedMovies) {
			return [];
		}
		const promises =
			topRatedMovies &&
			topRatedMovies?.results.map((favmovie) => getMovieDetail(favmovie.id));
		return Promise.all(promises);
	});
	const { data: topRatedImages, isLoading: topRatedImagesLoading } = useQuery<
		IGetImagesResult[]
	>(["topRated", "images"], async () => {
		if (!topRatedMovies) {
			return [];
		}
		const promises =
			topRatedMovies &&
			topRatedMovies?.results.map((nowPlaying) => getImages(nowPlaying.id));
		return Promise.all(promises);
	});

	const { data: nowPlayingMovies } = useQuery<IGetResult>(
		["nowPlaying", "nowPlayingMovies"],
		() => getNowPlaying()
	);
	const { data: nowPlayingDetails, isLoading: nowPlayingDetailsLoading } =
		useQuery<IGetMovieDetailResult[]>(["nowPlaying", "details"], async () => {
			if (!nowPlayingMovies) {
				return [];
			}
			const promises =
				nowPlayingMovies &&
				nowPlayingMovies?.results.map((favmovie) =>
					getMovieDetail(favmovie.id)
				);
			return Promise.all(promises);
		});
	const { data: nowPlayingImages, isLoading: nowPlayingImagesLoading } =
		useQuery<IGetImagesResult[]>(
			["nowPlayingImages", nowPlayingMovies],
			async () => {
				if (!nowPlayingMovies) {
					return [];
				}
				const promises =
					nowPlayingMovies &&
					nowPlayingMovies?.results.map((nowPlaying) =>
						getImages(nowPlaying.id)
					);
				return Promise.all(promises);
			}
		);
	const isPopularLoading = !popMovieDetailLoading && !popMovieImagesLoading;
	const isNowPlayingLoading =
		!nowPlayingDetailsLoading && !nowPlayingImagesLoading;

	useEffect(() => {
		setIsDoneLoading(true);
	}, [
		popMovieDetailLoading,
		popMovieImagesLoading,
		nowPlayingDetailsLoading,
		nowPlayingImagesLoading,
	]);
	console.log(isDoneLoading);
	return (
		<Container>
			{isHeroLoading ? (
				<Loader />
			) : (
				favMovieImages &&
				favMovieDetails && (
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
							heroMovieImages={favMovieImages}
							heroMovieDetails={favMovieDetails}
						/>
						{isDoneLoading && (
							<>
								<Section>
									<h1>Popular</h1>
									{popularMovieImages && popularMovieDetails && (
										<Slider
											imageData={popularMovieImages}
											detailData={popularMovieDetails}
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
						)}

						<Outlet context={{ movieImages: movieImages }} />
					</>
				)
			)}
		</Container>
	);
}

export default Home;
