import { ProductionCountry } from "./Interfaces/API/IGetMovieDetail";

export function makeImagePath(
	imageId: string | undefined | null,
	format?: string
) {
	if (imageId) {
		return `https://image.tmdb.org/t/p/${
			format ? format : "original"
		}/${imageId}`;
	}
	return NETFLIX_LOGO_URL;
}

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

export function formatTime(totalMinutes: number) {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${hours}h ${minutes}m`;
}

export function formatRating(vote_average: number | undefined) {
	if (vote_average) {
		return (vote_average / 2).toFixed(1);
	} else {
		return "N/A";
	}
}

export function getReleaseYear(date: Date | undefined) {
	if (date) {
		return date.getFullYear();
	} else {
		return "N/A";
	}
}

export function formatCountry(countryData: ProductionCountry) {
	const numSpaces = countryData.name.split(" ").length - 1;
	if (numSpaces > 2) {
		return countryData.iso_3166_1;
	}
	return countryData.name;
}

export function formatGenres(
	genres: { id: number; name: string }[] | null | undefined,
	format: string
) {
	if (genres) {
		const genreList: string[] = genres.map((item) =>
			item.name === "Science Fiction" ? "SF" : item.name
		);
		return genreList.slice(0, 3).join(format);
	}
	return null;
}

export const OFF_SET = 6;
export const SPIDERMAN_ID = 324857;
export const SLIDER_MARGIN = -window.innerHeight * 0.15;
export const NETFLIX_LOGO_URL =
	"https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";
