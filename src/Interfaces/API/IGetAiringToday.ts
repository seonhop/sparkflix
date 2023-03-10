// interface for TV api calls that don't take in a tv_id

export interface IGetTvResults {
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
