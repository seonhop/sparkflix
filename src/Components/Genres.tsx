import { IGetMovieDetailResult } from "../Interfaces/API/IGetDetails/IGetMovieDetail";
import { formatGenres } from "../utils/format";
import React from "react";
import { MidDot } from "./MidDot";
import { IGetTvDetailResult } from "../Interfaces/API/IGetDetails/IGetTvDetails";

export function Genres({
	movie,
}: {
	movie: IGetMovieDetailResult | IGetTvDetailResult;
}) {
	return (
		<div style={{ width: "100%" }}>{formatGenres(movie?.genres, " • ")}</div>
	);
}
