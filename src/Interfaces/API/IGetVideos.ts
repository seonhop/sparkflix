export interface IGetVideosResult {
	id: number;
	results: Result[];
}

export interface Result {
	iso_639_1: ISO639_1;
	iso_3166_1: ISO3166_1;
	name: string;
	key: string;
	published_at: Date;
	site: Site;
	size: number;
	type: Type;
	official: boolean;
	id: string;
}

export enum ISO3166_1 {
	Us = "US",
}

export enum ISO639_1 {
	En = "en",
}

export enum Site {
	YouTube = "YouTube",
}

export enum Type {
	Clip = "Clip",
	Featurette = "Featurette",
	Trailer = "Trailer",
}
