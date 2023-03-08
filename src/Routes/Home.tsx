import styled from "styled-components";
import { useQuery } from "react-query";
import { getMovies, getMovieDetail, getImages, getPopular } from "../api";
import { IGetMoviesResult } from "../Interfaces/API/IGetMovies";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { makeImagePath, SLIDER_MARGIN } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";
import { favMovieIDs, favMovieDict } from "../favMovies";
import {
	Outlet,
	useNavigate,
	useMatch,
	PathMatch,
	useOutletContext,
} from "react-router-dom";
import { OFF_SET, SPIDERMAN_ID } from "../utils";
import { HeroSlider, Slider } from "../Components/Slider";
import { dir } from "console";
import { IGetPopularResult } from "../Interfaces/API/IGetPopular";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 200vh;
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
	box-shadow: 0 0 40px 20px black;
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
	font-size: 1.5rem;
	font-weight: 600;
	width: 35%;
	line-height: 1.25;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	overflow: hidden;
	text-overflow: ellipsis;
`;

function Home() {
	const navigate = useNavigate();
	const { data: heroImage, isLoading: heroImageLoading } =
		useQuery<IGetImagesResult>(["heroImage", SPIDERMAN_ID], () =>
			getImages(SPIDERMAN_ID)
		);
	const { data: heroData } = useQuery<IGetMovieDetailResult>(
		["heroData", SPIDERMAN_ID],
		() => getMovieDetail(SPIDERMAN_ID)
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
		useQuery<IGetPopularResult>(["popular", "popularMovies"], () =>
			getPopular()
		);
	console.log(popularMovies);
	const movieImages = favMovieImages ? [...favMovieImages] : [];
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
						>
							<HeroTitleContainer>
								<HeroTitle
									src={makeImagePath(heroImage?.logos[0].file_path || "")}
								/>
							</HeroTitleContainer>
						</Hero>
						<Slider
							imageData={favMovieImages}
							detailData={favMovieDetails}
							wrapperMargin={SLIDER_MARGIN}
						/>
						<Outlet context={{ movieImages: movieImages }} />
					</>
				)
			)}
		</Container>
	);
}

export default Home;
