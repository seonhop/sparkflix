export function makeImagePath(imageId: string, format?: string) {
	return `https://image.tmdb.org/t/p/${
		format ? format : "original"
	}/${imageId}`;
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

export function formatGenres(
	genres: { id: number; name: string }[] | null | undefined
) {
	if (genres) {
		const genreList: string[] = genres.map((item) =>
			item.name === "Science Fiction" ? "SF" : item.name
		);
		return genreList.slice(0, 3);
	}
	return null;
}

export const OFF_SET = 6;
export const SPIDERMAN_ID = 324857;
export const SLIDER_MARGIN = -window.innerHeight * 0.15;
export const NEXFLIX_LOGO_URL =
	"https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";
