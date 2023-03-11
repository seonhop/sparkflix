import { useLocation } from "react-router-dom";
import { getSearchResults, useGetImages, fetchData } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetSearchResults } from "../Interfaces/API/IGetSearchResults";
import { IGetMovieImagesResult } from "../Interfaces/API/IGetImages";
import { makeImagePath } from "../utils/makePath";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetDetails/IGetMovieDetail";
import { Endpoint } from "../utils/consts";

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
	const location = useLocation();
	const keyword = new URLSearchParams(location.search).get("keyword");
	const { data } = useQuery<IGetSearchResults>(["searchResults", keyword], () =>
		getSearchResults(keyword as any)
	);

	const { data: detailSearchResults } = useQuery<IGetMovieDetailResult[]>(
		["detailSearchResults", keyword],
		async () => {
			const movies = data?.results.filter((movie) => movie.id) ?? [];
			console.log("movies..., ", movies);
			const promises = movies.map((movie) =>
				fetchData({
					endpoint: Endpoint.details,
					mediaType: undefined,
					id: movie.id,
					originalLanguage: movie.original_language,
				})
			);

			console.log("logging...", promises);
			const images = await Promise.all(promises);
			return images.flat();
		},
		{
			enabled: !!data,
		}
	);
	console.log(data);
	console.log(detailSearchResults);
	return (
		<>
			<SearchContainer>
				<h1>Search results for "{keyword}"</h1>
				<SearchResults>
					{data
						? data.results.map((result) =>
								result.backdrop_path ? (
									<div key={result.id}>
										<img src={makeImagePath(result.backdrop_path || "")} />
									</div>
								) : null
						  )
						: "Couldn't find"}
				</SearchResults>
			</SearchContainer>
		</>
	);
}

export default Search;
