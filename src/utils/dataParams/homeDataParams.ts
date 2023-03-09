import { IQueryParams } from "../utils";
import { ENDPOINT_KEYS } from "../consts";

export const heroDataParams: IQueryParams = {
	endpoint: "",
	identifier: "hero",
	mediaType: "movie",
	existsDefaultData: true,
};

export const nowPlayingDataParams: IQueryParams = {
	endpoint: ENDPOINT_KEYS.nowPlaying,
	identifier: ENDPOINT_KEYS.nowPlaying,
	mediaType: "movie",
	existsDefaultData: false,
};

export const popularDataParams: IQueryParams = {
	endpoint: ENDPOINT_KEYS.popular,
	identifier: ENDPOINT_KEYS.popular,
	mediaType: "movie",
	existsDefaultData: false,
};

export const topRatedDataParams: IQueryParams = {
	endpoint: ENDPOINT_KEYS.topRated,
	identifier: ENDPOINT_KEYS.topRated,
	mediaType: "movie",
	existsDefaultData: false,
};
