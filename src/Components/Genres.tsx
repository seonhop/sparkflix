import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";
import { formatGenres } from "../utils";
import React from "react";
import { MidDot } from "./MidDot";

export function Genres({ movie }: { movie: IGetMovieDetailResult }) {
	return (
		<div style={{ width: "100%" }}>{formatGenres(movie?.genres, " • ")}</div>
	);
}
