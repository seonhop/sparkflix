import { useQuery, QueryOptions } from "react-query";
import { fetchData, getImages, getMovieDetail } from "../api";
import { ENDPOINT_DICT } from "./consts";
import { favMovieIDs, IFavMovieIDs } from "./favMovies";
import { IGetResult } from "../Interfaces/API/IGetResults";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";

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

const useQueryParams = ({
	endpoint,
	identifier,
	existsDefaultData,
	mediaType,
}: IQueryParams) => {
	const fetchData_endpoint = ENDPOINT_DICT[endpoint].endpoint;
	//Fetching results for a selected endpoint such as popular, top_rated, now_playing, etc
	const { data: movieData, isLoading: moviesLoading } = useQuery<IGetResult>(
		[endpoint, identifier, "movies"],
		() => fetchData(fetchData_endpoint, mediaType)
	);
	const movies = existsDefaultData
		? favMovieIDs
		: useQuery<IGetResult>([endpoint, identifier, "movies"], () =>
				fetchData(fetchData_endpoint, mediaType)
		  ).data?.results || [];

	const { data: details, isLoading: detailsLoading } = useQuery<
		IGetMovieDetailResult[]
	>([endpoint, identifier, "details"], async () => {
		if (!movies) {
			return [];
		}
		const promises = movies.map((movie) => getMovieDetail(movie.id));
		return Promise.all(promises);
	});

	const { data: images, isLoading: imagesLoading } = useQuery<
		IGetImagesResult[]
	>([endpoint, identifier, "images"], async () => {
		if (!movies) {
			return [];
		}
		const promises = movies.map((movie) => getImages(movie.id));
		return Promise.all(promises);
	});

	return {
		data: {
			movies,
			details,
			images,
		},
		isLoading: moviesLoading || detailsLoading || imagesLoading,
	};
};
