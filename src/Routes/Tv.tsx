import styled from "styled-components";
import { useQuery } from "react-query";
import {
	getData,
	getDetail,
	getImages,
	getPopular,
	getNowPlaying,
	getTopRated,
	fetchData,
} from "../api";
import { IGetMoviesResult } from "../Interfaces/API/IGetMovies";
import { IGetMovieImagesResult } from "../Interfaces/API/IGetImages";
import { makeImagePath } from "../utils/makePath";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { IGetTvDetailResult } from "../Interfaces/API/IGetDetails/IGetTvDetails";
import { favMovieIDs, favMovieDict } from "../utils/favMovies";
import {
	Outlet,
	useNavigate,
	useMatch,
	PathMatch,
	useOutletContext,
} from "react-router-dom";
import { OFF_SET, HERO_TV_ID, SLIDER_MARGIN, Endpoint } from "../utils/consts";
import { Slider } from "../Components/Slider/Slider";
import { dir } from "console";
import { IGetResult } from "../Interfaces/API/IGetResults";
import { heroDataParams } from "../utils/dataParams";

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

// linear-gradient(to top, #000000, 5%, transparent), linear-gradient(to bottom, #0c0c0c, 5%, transparent),

const Hero = styled.div<{ bgPhoto: string }>`
	display: flex;
	height: 100vh;
	width: 100%;
	justify-content: center;
	align-items: flex-start;
	flex-direction: column;
	padding: 0 3.5rem;
	gap: 2rem;

	background-color: #000000;
	background-image: linear-gradient(
			to top,
			transparent 90%,
			rgba(28, 28, 28, 0.8) 100%
		),
		linear-gradient(
			to bottom,
			transparent 90%,
			#0c0c0c 100%,
			#111 98%,
			#222 96%,
			#333 94%,
			#555 92%
		),
		url(${(props) => props.bgPhoto});
	background-size: cover;
	box-shadow: 0 0 40px 20px black;
`;

//linear-gradient(to right, #000, rgba(0, 0, 0, 0), #000),

const HeroTitleContainer = styled.div`
	width: 30%;
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

const TvBody = styled.div`
	margin-top: 100vh;
`;

function Tv() {
	const navigate = useNavigate();
	const onHeroClick = () => {
		navigate(`/tv/${HERO_TV_ID}`);
	};
	const [isDoneLoading, setIsDoneLoading] = useState(false);
	const { data: heroImage, isLoading: heroImageLoading } =
		useQuery<IGetMovieImagesResult>(["heroImage", HERO_TV_ID], () =>
			fetchData(Endpoint.images, "tv", HERO_TV_ID)
		);
	const { data: favMovies, isLoading: favMovieLoading } = useQuery<IGetResult>(
		["fav", "tv"],
		() =>
			fetchData(
				Endpoint.popular,
				"tv",
				undefined,
				undefined,
				undefined,
				undefined,
				"ko"
			)
	);
	const { data: favDetails, isLoading: favDetailsloading } = useQuery<
		IGetTvDetailResult[]
	>(["fav", "tv", "details"], async () => {
		if (!favMovies) {
			return [];
		}
		const promises =
			favMovies &&
			favMovies?.results.map((movie) =>
				fetchData(Endpoint.details, "tv", movie.id, movie.original_language)
			);
		return Promise.all(promises);
	});
	const { data: favImages, isLoading: favImagesLoading } = useQuery<
		IGetMovieImagesResult[]
	>(["fav", "tv", "images"], async () => {
		if (!favMovies) {
			return [];
		}
		const promises =
			favMovies &&
			favMovies.results.map((movie) =>
				fetchData(Endpoint.images, "tv", movie.id, movie.original_language)
			);
		return Promise.all(promises);
	});

	const { data: popularMovies } = useQuery<IGetResult>(
		["popular", "tv", "data"],
		() => fetchData(Endpoint.popular, "tv")
	);
	const { data: popularDetails, isLoading: popularDetailsloading } = useQuery<
		IGetTvDetailResult[]
	>(["popular", "tv", "details"], async () => {
		if (!popularMovies) {
			return [];
		}
		const promises =
			popularMovies &&
			popularMovies?.results.map((movie) =>
				fetchData(Endpoint.details, "tv", movie.id, movie.original_language)
			);
		return Promise.all(promises);
	});
	const { data: popularImages, isLoading: popularImagesLoading } = useQuery<
		IGetMovieImagesResult[]
	>(["popular", "tv", "images"], async () => {
		if (!popularMovies) {
			return [];
		}
		const promises =
			popularMovies &&
			popularMovies?.results.map((movie) =>
				fetchData(Endpoint.images, "tv", movie.id, movie.original_language)
			);
		return Promise.all(promises);
	});

	const { data: topRatedMovies } = useQuery<IGetResult>(
		["topRated", "tv", "data"],
		() => fetchData(Endpoint.topRated, "tv")
	);
	const { data: topRatedDetails, isLoading: topRatedDetailsloading } = useQuery<
		IGetTvDetailResult[]
	>(["topRated", "tv", "details"], async () => {
		if (!topRatedMovies) {
			return [];
		}
		const promises =
			topRatedMovies &&
			topRatedMovies?.results.map((movie) =>
				fetchData(Endpoint.details, "tv", movie.id, movie.original_language)
			);
		return Promise.all(promises);
	});
	const { data: topRatedImages, isLoading: topRatedImagesLoading } = useQuery<
		IGetMovieImagesResult[]
	>(["topRated", "tv", "images"], async () => {
		if (!topRatedMovies) {
			return [];
		}
		const promises =
			topRatedMovies &&
			topRatedMovies?.results.map((movie) =>
				fetchData(Endpoint.images, "tv", movie.id, movie.original_language)
			);
		return Promise.all(promises);
	});

	const { data: nowPlayingMovies } = useQuery<IGetResult>(
		["nowPlaying", "tv", "data"],
		() => fetchData(Endpoint.airingToday, "tv")
	);
	const { data: nowPlayingDetails, isLoading: nowPlayingDetailsLoading } =
		useQuery<IGetTvDetailResult[]>(
			["nowPlaying", "tv", "details"],
			async () => {
				if (!nowPlayingMovies) {
					return [];
				}
				const promises =
					nowPlayingMovies &&
					nowPlayingMovies?.results.map((movie) =>
						fetchData(Endpoint.details, "tv", movie.id, movie.original_language)
					);
				return Promise.all(promises);
			}
		);
	const { data: nowPlayingImages, isLoading: nowPlayingImagesLoading } =
		useQuery<IGetMovieImagesResult[]>(
			["nowPlaying", "tv", "images"],
			async () => {
				if (!nowPlayingMovies) {
					return [];
				}
				const promises =
					nowPlayingMovies &&
					nowPlayingMovies?.results.map((movie) =>
						fetchData(Endpoint.images, "tv", movie.id, movie.original_language)
					);
				return Promise.all(promises);
			}
		);
	const isNowPlayingLoading =
		nowPlayingDetailsLoading || nowPlayingImagesLoading;
	const isPopularLoading = popularDetailsloading || popularImagesLoading;
	const isTopRatedLoading = topRatedDetailsloading || topRatedImagesLoading;
	const isHeroLoading = favDetailsloading || favImagesLoading;

	/*
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
	
	*/

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
							bgPhoto={makeImagePath(heroImage?.backdrops[1].file_path || "")}
							onClick={onHeroClick}
						>
							<HeroTitleContainer>
								<HeroTitle
									src={makeImagePath(heroImage?.logos[0].file_path || "")}
								/>
							</HeroTitleContainer>
						</Hero>

						<TvBody>
							<Section>
								<h1>Recommended</h1>
								<Slider
									imageData={favImages}
									detailData={favDetails}
									wrapperMargin={SLIDER_MARGIN}
									sliderType="fav"
									inBigMovie={false}
									mediaType="tv"
								/>
							</Section>
							<Section>
								<h1>Popular</h1>
								{popularImages && popularDetails && (
									<Slider
										imageData={popularImages}
										detailData={popularDetails}
										sliderType="popular"
										inBigMovie={false}
										mediaType="tv"
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
										inBigMovie={false}
										mediaType="tv"
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
										inBigMovie={false}
										mediaType="tv"
									/>
								)}
							</Section>
						</TvBody>

						<Outlet />
					</>
				)
			)}
		</Container>
	);
}

export default Tv;
