import { ProductionCountry } from "../Interfaces/API/IGetDetails/IGetMovieDetail";

export function formatTime(totalMinutes: number) {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	if (totalMinutes < 60) {
		return `${minutes}m`;
	}
	return `${hours}h ${minutes}m`;
}

export function formatAirDate(date: number) {
	const today = new Date();
	const formattedDate = new Date(date);

	if (formattedDate.getFullYear() < today.getFullYear()) {
		return `${formattedDate.toLocaleString("default", {
			month: "short",
		})} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`;
	} else {
		return `${formattedDate.toLocaleString("default", {
			month: "short",
		})} ${formattedDate.getDate()}`;
	}
}

export function formatRating(vote_average: number | undefined) {
	if (vote_average) {
		return (vote_average / 2).toFixed(1);
	} else {
		return "N/A";
	}
}

export function formatVoteCount(vote_count: number | undefined) {
	if (vote_count) {
		return `(${vote_count.toLocaleString()})`;
	}
	return "";
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
		return genreList.slice(0, 3).join(format).length < 20
			? genreList.slice(0, 3).join(format)
			: genreList.slice(0, 2).join(format);
	}
	return null;
}
