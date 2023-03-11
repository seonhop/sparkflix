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
	margin-top: 25vh;
`;

function Home() {
	const navigate = useNavigate();
	const onHeroClick = () => {
		navigate(`/movies/${HERO_ID}`);
	};
	let mediaType = QueryMediaType.movie;
	const [isDoneLoading, setIsDoneLoading] = useState(false);
	const { data: heroImage, isLoading: heroImageLoading } =
		useQuery<IGetMovieImagesResult>(["heroImage", HERO_ID], () =>
			fetchData({ endpoint: Endpoint.images, mediaType, id: HERO_ID })
		);
	const { data: favDetails, isLoading: favDetailsLoading } = useGetDetails({
		endpoint: "fav",
		mediaList: favMovies,
		mediaType,
	});
	const { data: favImages, isLoading: favImagesLoading } = useGetImages({
		endpoint: "fav",
		mediaList: favMovies,
		mediaType,
	});
	const isFavLoading = favDetailsLoading || favImagesLoading;

	const {
		mediaDetails: trDetails,
		mediaImages: trImages,
		isMediaLoading: isTRLoading,
	} = useGetMedia({
		endpoint: Endpoint.topRated,
		mediaType,
	});
	const {
		mediaDetails: npDetails,
		mediaImages: npImages,
		isMediaLoading: isNPLoading,
	} = useGetMedia({
		endpoint: Endpoint.nowPlaying,
		mediaType,
	});
	const {
		mediaDetails: popDetails,
		mediaImages: popImages,
		isMediaLoading: isPopLoading,
	} = useGetMedia({
		endpoint: Endpoint.popular,
		mediaType,
	});

	// tarantino = 138
	const {
		mediaDetails: tarantinoDetails,
		mediaImages: tarantinoImages,
		isMediaLoading: isQTLoading,
	} = useGetMedia({
		endpoint: Endpoint.discover,
		mediaType,
		people: "138",
	});
	const {
		mediaDetails: bongDetails,
		mediaImages: bongImages,
		isMediaLoading: isBongLoading,
	} = useGetMedia({
		endpoint: Endpoint.discover,
		mediaType,
		people: "21684",
	});
	const {
		mediaDetails: scorseseDetails,
		mediaImages: scorseseImages,
		isMediaLoading: isScorseseLoading,
	} = useGetMedia({
		endpoint: Endpoint.discover,
		mediaType,
		people: "1032",
	});
	const {
		mediaDetails: parkDetails,
		mediaImages: parkImages,
		isMediaLoading: isParkLoading,
	} = useGetMedia({
		endpoint: Endpoint.discover,
		mediaType,
		people: "10099",
	});
	const {
		mediaDetails: comedyDetails,
		mediaImages: comedyImages,
		isMediaLoading: isComedyLoading,
	} = useGetMedia({
		endpoint: Endpoint.discover,
		mediaType,
		genre: MovieGenreIds.comedy, //scorsege 1032 bong joon-ho 21684 park 10099
	});
	const {
		mediaDetails: romanceDetails,
		mediaImages: romanceImages,
		isMediaLoading: isRomanceLoading,
	} = useGetMedia({
		endpoint: Endpoint.discover,
		mediaType,
		genre: MovieGenreIds.romance, //scorsege 1032
	});
	useEffect(() => {
		setIsDoneLoading(
			!isFavLoading &&
				!isTRLoading &&
				!isNPLoading &&
				!isPopLoading &&
				!isQTLoading &&
				!isComedyLoading &&
				!isRomanceLoading &&
				!isBongLoading &&
				!isScorseseLoading &&
				!isParkLoading
		);
	}, [isFavLoading, isTRLoading, isNPLoading, isPopLoading, isQTLoading]);
	console.log("isDoneLoading", isDoneLoading);
	console.log("QT", tarantinoDetails, tarantinoImages);
	return (
		<Container>
			{heroImageLoading && !isDoneLoading ? (
				<Loader />
			) : (
				favImages &&
				favDetails && (
					<>
						<Hero
							bgPhoto={makeImagePath(heroImage?.backdrops[7].file_path || "")}
							onClick={onHeroClick}
						>
							<HeroTitleContainer>
								<HeroTitle
									src={makeImagePath(heroImage?.logos[0].file_path || "")}
								/>
							</HeroTitleContainer>
						</Hero>
						{favImages && favDetails && (
							<Slider
								imageData={favImages}
								detailData={favDetails}
								wrapperMargin={SLIDER_MARGIN}
								sliderType="fav"
								inBigMovie={false}
								mediaType="movies"
							/>
						)}

						<>
							<Section>
								<h1>Popular</h1>
								{popImages && popDetails && (
									<Slider
										imageData={popImages}
										detailData={popDetails}
										sliderType="popular"
										inBigMovie={false}
										mediaType="movies"
									/>
								)}
							</Section>
							<Section>
								<h1>Now Playing</h1>
								{npImages && npDetails && (
									<Slider
										imageData={npImages}
										detailData={npDetails}
										sliderType="nowPlaying"
										inBigMovie={false}
										mediaType="movies"
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
										mediaType="movies"
									/>
								)}
							</Section>

							<Section>
								<h1>Tarantino's</h1>
								{tarantinoDetails && tarantinoImages && (
									<Slider
										imageData={tarantinoImages}
										detailData={tarantinoDetails}
										sliderType="tarantino"
										inBigMovie={false}
										mediaType="movies"
									/>
								)}
							</Section>
							<Section>
								<h1>Scorsese's</h1>
								{scorseseDetails && scorseseImages && (
									<Slider
										imageData={scorseseImages}
										detailData={scorseseDetails}
										sliderType="scorsese"
										inBigMovie={false}
										mediaType="movies"
									/>
								)}
							</Section>
							<Section>
								<h1>Bong Joon-ho's</h1>
								{bongDetails && bongImages && (
									<Slider
										imageData={bongImages}
										detailData={bongDetails}
										sliderType="bong"
										inBigMovie={false}
										mediaType="movies"
									/>
								)}
							</Section>
							<Section>
								<h1>Park Chan-wook's</h1>
								{parkDetails && parkImages && (
									<Slider
										imageData={parkImages}
										detailData={parkDetails}
										sliderType="park"
										inBigMovie={false}
										mediaType="movies"
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
										mediaType="movies"
									/>
								)}
							</Section>
							<Section>
								<h1>Romance</h1>
								{romanceDetails && romanceImages && (
									<Slider
										imageData={romanceImages}
										detailData={romanceDetails}
										sliderType="romance"
										inBigMovie={false}
										mediaType="movies"
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
