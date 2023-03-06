export function makeImagePath(imageId: string, format?: string) {
	return `https://image.tmdb.org/t/p/${
		format ? format : "original"
	}/${imageId}`;
}

export const OFF_SET = 6;
export const SPIDERMAN_ID = 324857;
