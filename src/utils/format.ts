import { useQuery } from "react-query";
import { getGenreIdList } from "../api";
import { ProductionCountry } from "../Interfaces/API/IGetDetails/IGetMovieDetail";
import { API_KEY, BASE_PATH } from "./consts";

export function formatTime(totalMinutes: number | undefined) {
	if (totalMinutes) {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		if (totalMinutes < 60) {
			return `${minutes}m`;
		}
		return `${hours}h ${minutes}m`;
	}
	return null;
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

export interface IGenreIdResult {
	genres: { id: number; name: string }[];
}

interface IFormatGenres {
	format: string;
	genreIdList?: IGenreIdResult;
	inputObjList?: { id: number; name: string }[];
	inputIdList?: number[];
}
export function formatGenres({
	format,
	inputIdList,
	inputObjList,
	genreIdList,
}: IFormatGenres) {
	console.log("inputIdList", inputIdList);
	if ((inputIdList && genreIdList) || inputObjList) {
		let genres = undefined;
		if (inputIdList && genreIdList) {
			console.log("genre hereeee");
			genres = genreIdList.genres
				.filter((genre) => inputIdList.includes(genre.id))
				.map((genre) => genre.name);
			console.log("search genre result", genres);
		} else if (inputObjList) {
			genres = inputObjList.map((item) =>
				item.name === "Science Fiction" ? "SF" : item.name
			);
		}
		if (genres) {
			return genres.slice(0, 3).join(format).length < 20
				? genres.slice(0, 3).join(format)
				: genres.slice(0, 2).join(format);
		}
		return null;
	}
	return null;
}
