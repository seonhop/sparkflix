export interface IGetRecommendsResults {
	page: number;
	results: IMovieRecommendsResult[] | ITvRecommendsResult[];
	total_pages: number;
	total_results: number;
}

export interface IMovieRecommendsResult {
	adult: boolean;
	backdrop_path: string;
	id: number;
	title: string;
	original_language: OriginalLanguage;
	original_title: string;
	overview: string;
	poster_path: string;
	media_type: "movie" | "tv";
	genre_ids: number[];
	popularity: number;
	release_date: Date;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface ITvRecommendsResult {
	adult: boolean;
	backdrop_path: string;
	id: number;
	name: string;
	original_language: OriginalLanguage;
	original_name: string;
	overview: string;
	poster_path: string;
	media_type: "movie" | "tv";
	genre_ids: number[];
	popularity: number;
	first_air_date: Date;
	vote_average: number;
	vote_count: number;
	origin_country: OriginCountry[];
}

enum MediaType {
	Movie = "movie",
}

enum OriginalLanguage {
	En = "en",
	Ja = "ja",
}

enum OriginCountry {
	CN = "CN",
	GB = "GB",
	Jp = "JP",
	Us = "US",
}
