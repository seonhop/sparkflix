import { useQuery, QueryOptions } from "react-query";
import { IGetResult } from "../Interfaces/API/IGetResults";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetDetails/IGetMovieDetail";
import { IGetMovieImagesResult } from "../Interfaces/API/IGetImages";
import { IGetTvDetailResult } from "../Interfaces/API/IGetDetails/IGetTvDetails";
import { useEffect } from "react";
import { BASE_PATH, API_KEY } from "../utils/consts";

export interface IQueryParams {
	endpoint: string;
	identifier: string;
	mediaType: "movie" | "tv";
	existsDefaultData: boolean;
}

export function isMovieDetail(
	mediaItem: any
): mediaItem is IGetMovieDetailResult {
	return (
		mediaItem &&
		mediaItem.hasOwnProperty("title") &&
		!mediaItem.hasOwnProperty("genre_ids")
	);
}

export function isTvDetail(mediaItem: any): mediaItem is IGetTvDetailResult {
	return (
		mediaItem &&
		mediaItem.hasOwnProperty("name") &&
		!mediaItem.hasOwnProperty("genre_ids")
	);
}
