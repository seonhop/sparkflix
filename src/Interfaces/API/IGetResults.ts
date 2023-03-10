export type IGetResult = IGetMovieResult | IGetTvResult;

export interface IGetMovieResult {
	page: number;
	results: MovieResult[];
	total_pages: number;
	total_results: number;
}

interface MovieResult {
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	id: number;
	original_language: OriginalLanguage;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: Date;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export enum OriginalLanguage {
	En = "en",
	Es = "es",
	It = "it",
}

interface IGetTvResult {
	page: number;
	results: TvResult[];
	total_pages: number;
	total_results: number;
}

interface TvResult {
	backdrop_path: string;
	first_air_date: Date;
	genre_ids: number[];
	id: number;
	name: string;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	vote_average: number;
	vote_count: number;
}
