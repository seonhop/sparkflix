import { useQuery, QueryOptions } from "react-query";
import { IGetResult } from "../Interfaces/API/IGetResults";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetDetails/IGetMovieDetail";
import { IGetMovieImagesResult } from "../Interfaces/API/IGetImages";
import { IGetTvDetailResult } from "../Interfaces/API/IGetDetails/IGetTvDetails";
import { useEffect } from "react";
import { BASE_PATH, API_KEY } from "../api";

export interface IQueryParams {
	endpoint: string;
	identifier: string;
	mediaType: "movie" | "tv";
	existsDefaultData: boolean;
}

/* 
A function for fetching different movie/tv data such as popular, top_rated, etc. 
`defaultData`, if exists, would be a list containing my favorite movies' titles and IDs
*/

/* 
const SelectData = ({
	endpoint,
	identifier,
	existsDefaultData,
	mediaType,
}: IQueryParams) => {
	const fetchData_endpoint = ENDPOINT_DICT[endpoint]?.endpoint;
	const { data: movieData, isLoading: moviesLoading } = useQuery<IGetResult>(
		[endpoint, identifier, "movies"],
		() => fetchData(fetchData_endpoint, mediaType)
	);
	if (existsDefaultData) {
		return favMovieIDs;
	}
	return movieData?.results;
};

export const useQueryParams = ({
	endpoint,
	identifier,
	existsDefaultData,
	mediaType,
}: IQueryParams) => {
	const fetchData_endpoint = ENDPOINT_DICT[endpoint]?.endpoint;
	const { data: movieData, isLoading: moviesLoading } = useQuery<IGetResult>(
		[endpoint, identifier, "movies"],
		() => fetchData(fetchData_endpoint, mediaType)
	);

	const movies = SelectData({
		endpoint,
		identifier,
		existsDefaultData,
		mediaType,
	});
	console.log("movies", movies);

	//Fetching results for a selected endpoint such as popular, top_rated, now_playing, etc

	const { data: details, isLoading: detailsLoading } = useQuery<
		IGetMovieDetailResult[]
	>([endpoint, identifier, mediaType, "details"], async () => {
		if (!movies) {
			return [];
		}
		const promises = movies.map((movie) =>
			getDetail(movie.id, movie.original_language)
		);
		return Promise.all(promises);
	});

	const { data: images, isLoading: imagesLoading } = useQuery<
		IGetMovieImagesResult[]
	>([endpoint, identifier, mediaType, "images"], async () => {
		if (!movies) {
			return [];
		}
		const promises = movies.map((movie) =>
			fetchData("images", mediaType, movie.id)
		);

		return Promise.all(promises);
	});
	const { data: imagesTmp, isLoading: imagesTmpLoading } = useQuery<
		IGetMovieImagesResult[]
	>([endpoint, identifier, mediaType, "images"], async () => {
		if (!movies) {
			return [];
		}
		const promises = movies.map((movie) =>
			getImages(movie.id, movie.original_language)
		);
		return Promise.all(promises);
	});
	return {
		movies,
		details,
		images,
		isLoading: moviesLoading || detailsLoading || imagesLoading,
	};
};


*/
