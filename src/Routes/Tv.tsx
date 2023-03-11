import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchData, useGetMedia, useGetDetails, useGetImages } from "../api";
import { IGetMoviesResult } from "../Interfaces/API/IGetMovies";
import { IGetMovieImagesResult } from "../Interfaces/API/IGetImages";
import { makeImagePath } from "../utils/makePath";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetDetails/IGetMovieDetail";
import {
	Outlet,
	useNavigate,
	useMatch,
	PathMatch,
	useOutletContext,
} from "react-router-dom";
import {
	OFF_SET,
	HERO_ID as HERO_ID,
	SLIDER_MARGIN,
	Endpoint,
	MovieGenreIds,
	QueryMediaType,
	HERO_TV_ID,
	TvGenreIds,
} from "../utils/consts";
import { Slider } from "../Components/Slider/Slider";
import { dir } from "console";
import { IGetResult } from "../Interfaces/API/IGetResults";
import { heroDataParams } from "../utils/dataParams";
import { favMovies } from "../utils/consts";

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
	&:not(:nth-child(2)) {
		margin-top: 25vh;
	}
	&:nth-child(2) {
		margin-top: 10vh;
	}
`;

const HeroButtonContainer = styled.div`
	display: grid;
	width: 100%;
	justify-content: space-between;
	grid-template-columns: 1fr 1fr;
	grid-gap: 20px;
	margin-top: 3vh;
	div {
		display: flex;
		padding: 12px 16px;
		border-radius: 8px;
		justify-content: center;
		align-items: center;
		gap: 8px;
		background-color: rgba(255, 255, 255, 1);
		color: ${(props) => props.theme.black.darker};
		:hover {
			background-color: rgb(222, 222, 222);
			cursor: pointer;
		}
		> span:first-child {
			font-size: 2rem;
		}
		> span:last-child {
			font-size: 1.2rem;
		}
		&:last-child {
			background-color: rgba(0, 0, 0, 0.4);
			color: ${(props) => props.theme.white.lighter};
			:hover {
				background-color: rgba(0, 0, 0, 0.7);
			}
		}
	}
`;

function Tv() {
	let mediaType = QueryMediaType.tv;

	const navigate = useNavigate();
	const onHeroClick = () => {
		navigate(`/${mediaType}/${HERO_TV_ID}`);
	};
	const [isDoneLoading, setIsDoneLoading] = useState(false);
	const { data: heroImage, isLoading: heroImageLoading } =
		useQuery<IGetMovieImagesResult>(["heroImage", HERO_TV_ID], () =>
			fetchData({ endpoint: Endpoint.images, mediaType, id: HERO_TV_ID })
		);
	console.log("heroimage", heroImage);
	const {
		mediaDetails: favDetails,
		mediaImages: favImages,
		isMediaLoading: favLoading,
	} = useGetMedia({
		endpoint: Endpoint.popular,
		mediaType,
		originalLanguage: "ko",
	});

	const {
		mediaDetails: trDetails,
		mediaImages: trImages,
		isMediaLoading: trLoading,
	} = useGetMedia({
		endpoint: Endpoint.topRated,
		mediaType,
	});
	console.log("tv tr", trDetails);
	const {
		mediaDetails: onAirDetails,
		mediaImages: onAirImages,
		isMediaLoading: onAirLoading,
	} = useGetMedia({
		endpoint: Endpoint.airingToday,
		mediaType,
	});
	const {
		mediaDetails: popDetails,
		mediaImages: popImages,
		isMediaLoading: popLoading,
	} = useGetMedia({
		endpoint: Endpoint.popular,
		mediaType,
	});

	const {
		mediaDetails: comedyDetails,
		mediaImages: comedyImages,
		isMediaLoading: comedyLoading,
	} = useGetMedia({
		endpoint: Endpoint.discover,
		mediaType,
		genre: TvGenreIds.comedy, //scorsege 1032 bong joon-ho 21684 park 10099
	});
	const {
		mediaDetails: talkDetails,
		mediaImages: talkImages,
		isMediaLoading: talkLoading,
	} = useGetMedia({
		endpoint: Endpoint.discover,
		mediaType,
		genre: TvGenreIds.talk, //scorsege 1032
		originalLanguage: "en",
	});
	const {
		mediaDetails: animationDetails,
		mediaImages: animationImages,
		isMediaLoading: animationLoading,
	} = useGetMedia({
		endpoint: Endpoint.discover,
		mediaType,
		genre: MovieGenreIds.animation, //scorsege 1032
		originalLanguage: "en",
	});
	useEffect(() => {
		setIsDoneLoading(
			!favLoading &&
				!trLoading &&
				!onAirLoading &&
				!popLoading &&
				!comedyLoading &&
				!talkLoading &&
				!animationLoading
		);
	}, []);
	console.log("isDoneLoading", isDoneLoading);
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
								<HeroButtonContainer>
									<div>
										<span className="material-icons-round">play_arrow</span>

										<span>Play</span>
									</div>
									<div onClick={onHeroClick}>
										<span className="material-icons-outlined">info</span>{" "}
										<span>Info</span>
									</div>
								</HeroButtonContainer>
							</HeroTitleContainer>
						</Hero>

						<>
							<Section>
								<h1>Recommended</h1>
								{favImages && favDetails && (
									<Slider
										imageData={favImages}
										detailData={favDetails}
										sliderType="fav"
										inBigMovie={false}
										mediaType="tv"
									/>
								)}
							</Section>
							<Section>
								<h1>Airing Today</h1>
								{onAirImages && onAirDetails && (
									<Slider
										imageData={onAirImages}
										detailData={onAirDetails}
										sliderType="onAir"
										inBigMovie={false}
										mediaType="tv"
									/>
								)}
							</Section>
							<Section>
								<h1>Top Rated</h1>
								{trDetails && trImages && (
									<Slider
										imageData={trImages}
										detailData={trDetails}
										sliderType="topRated"
										inBigMovie={false}
										mediaType="tv"
									/>
								)}
							</Section>
							<Section>
								<h1>Popular</h1>
								{popImages && popDetails && (
									<Slider
										imageData={popImages}
										detailData={popDetails}
										sliderType="popular"
										inBigMovie={false}
										mediaType="tv"
									/>
								)}
							</Section>

							<Section>
								<h1>Comedy</h1>
								{comedyDetails && comedyImages && (
									<Slider
										imageData={comedyImages}
										detailData={comedyDetails}
										sliderType="comedy"
										inBigMovie={false}
										mediaType="tv"
									/>
								)}
							</Section>
							<Section>
								<h1>Talk shows</h1>
								{talkDetails && talkImages && (
									<Slider
										imageData={talkImages}
										detailData={talkDetails}
										sliderType="talk"
										inBigMovie={false}
										mediaType="tv"
									/>
								)}
							</Section>
							<Section>
								<h1>Animation</h1>
								{animationDetails && animationImages && (
									<Slider
										imageData={animationImages}
										detailData={animationDetails}
										sliderType="animation"
										inBigMovie={false}
										mediaType="tv"
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

export default Tv;
