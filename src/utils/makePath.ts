import {
	NETFLIX_BLACK_URL,
	NETFLIX_LOGO_BLACK_URL,
	NETFLIX_LOGO_URL,
} from "./consts";

export function makeAvatarPath(path: string | null) {
	const htmlUrlRegExp = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/;
	const tmpPath = path?.startsWith("/") ? path.slice(1) : path;
	if (tmpPath) {
		if (htmlUrlRegExp.test(tmpPath)) {
			return tmpPath;
		}
		return `https://image.tmdb.org/t/p/original${path}`;
	}
	return NETFLIX_LOGO_URL;
}

export function makeImagePath(
	imageId: string | undefined | null,
	format?: string,
	dark?: boolean
) {
	if (imageId) {
		return `https://image.tmdb.org/t/p/${
			format ? format : "original"
		}/${imageId}`;
	}
	return NETFLIX_LOGO_BLACK_URL;
}

export function makeMovieLogoPath(
	imageId: string | undefined,
	format?: string
) {
	if (imageId) {
		return `https://image.tmdb.org/t/p/${
			format ? format : "original"
		}/${imageId}`;
	}
	return undefined;
}
