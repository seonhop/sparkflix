export interface IGetImagesResult {
	backdrops: Backdrop[];
	id: number;
	logos: Backdrop[];
	posters: Backdrop[];
}

export interface Backdrop {
	aspect_ratio: number;
	height: number;
	iso_639_1: ISO639_1;
	file_path: string;
	vote_average: number;
	vote_count: number;
	width: number;
}

export enum ISO639_1 {
	En = "en",
}
