import { useLocation, useNavigate } from "react-router-dom";
import { getSearchResults, useGetImages, fetchData, useGetMedia } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetSearchResults } from "../Interfaces/API/IGetSearchResults";
import { IGetMovieImagesResult } from "../Interfaces/API/IGetImages";
import { makeImagePath } from "../utils/makePath";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetDetails/IGetMovieDetail";
import { Endpoint, QueryMediaType } from "../utils/consts";
import { useState } from "react";
import { MovieTvBox } from "../Components/Slider/MovieTvBox";
import { Outlet } from "react-router-dom";
import { Slider } from "../Components/Slider/Slider";
import { Section } from "./Home";
import { isTvDetail } from "../utils/utils";

const SearchContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-top: 4.5rem;
	padding: 3.5rem 3.5rem;
	> h1 {
		font-size: 2rem;
	}
`;

const SearchResults = styled.div`
	margin-top: 10vh;
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-gap: 8px;
	grid-row-gap: 3rem;

	width: 100%;
	> div {
		height: 130px;
		background-size: cover;
		background-position: center center;
		border-radius: 4px;
		> img {
			max-width: 100%;
			max-height: 100%;
			border-radius: 4px;
		}
	}
`;

function Search() {
	/* 
		handleBoxIndexHover,
	mediaItem,
	imageData,
	sliderType,
	hoveredIndex,
	onExpandClicked,
	*/
	const [leaving, setLeaving] = useState(false);
	const [hoveredIndex, setHoveredIndex] = useState(-1);
	const navigate = useNavigate();
	const handleBoxIndexHover = (index: number) => {
		setHoveredIndex(index);
	};

	const location = useLocation();
	const keyword = new URLSearchParams(location.search).get("keyword");

	const { data } = useQuery<IGetSearchResults>(["searchResults", keyword], () =>
		getSearchResults(keyword as any)
	);
	const { data: imagesData, isLoading: imagesDataLoading } = useQuery<
		IGetMovieImagesResult[]
	>([keyword, data, "images"], async () => {
		if (!data) {
			return [];
		}
		const promises =
			data &&
			data?.results.map((result) =>
				fetchData({
					endpoint: Endpoint.images,
					mediaType: result.media_type,
					id: result.id,
					originalLanguage: result.original_language,
				})
			);
		return Promise.all(promises);
	});
	console.log("search imgaes", imagesData);
	console.log("search keyword", keyword);
	const onExpandClicked = (id: string, mediaType: string | undefined) => {
		navigate({
			pathname: `/search/${mediaType}/${id}`,
			search: `?keyword=${keyword}`,
		});
		//navigate(`/search/${mediaType}/${id}`);
	};
	console.log(data);
	console.log("data", data?.results[0].media_type);
	const filteredData = data?.results.filter((item) => item.backdrop_path);
	const movieData = filteredData?.filter((item) => item.media_type === "movie");
	const tvData = filteredData?.filter((item) => item.media_type === "tv");

	console.log("movieData", movieData);
	console.log("tvData", tvData);
	console.log("isit?", isTvDetail(tvData && tvData[0]));

	return (
		<>
			<SearchContainer>
				<h1>Search results for "{keyword}"</h1>
				{movieData || tvData ? (
					<>
						{movieData?.length !== 0 && (
							<Section>
								<h1>Movies</h1>
								<Slider
									imageData={imagesData}
									detailData={movieData}
									inBigMovie={false}
									sliderType="searchMovies"
									mediaType="movies"
									onClick={onExpandClicked}
									path={keyword as string}
								/>
							</Section>
						)}
						{tvData?.length !== 0 && (
							<Section>
								<h1>TV Shows</h1>
								<Slider
									imageData={imagesData}
									detailData={tvData}
									inBigMovie={false}
									sliderType="searchTv"
									mediaType="tv"
									onClick={onExpandClicked}
									path={keyword as string}
								/>
							</Section>
						)}
					</>
				) : (
					<h1>No result</h1>
				)}

				<Outlet context={keyword} />
			</SearchContainer>
		</>
	);
}

export default Search;
