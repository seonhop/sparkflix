import { IGetMovieDetailResult } from "../Interfaces/API/IGetDetails/IGetMovieDetail";
import { formatGenres } from "../utils/format";
import React from "react";
import { MidDot } from "./MidDot";
import { IGetTvDetailResult } from "../Interfaces/API/IGetDetails/IGetTvDetails";
import { SearchResult } from "../Interfaces/API/IGetSearchResults";
import { isMovieDetail, isTvDetail } from "../utils/utils";
import { useQuery } from "react-query";
import { IGenreIdResult } from "../utils/consts";
import { getGenreIdList, useGetGenreIdList } from "../api";

export function Genres({
	mediaItem,
}: {
	mediaItem: IGetMovieDetailResult | IGetTvDetailResult | SearchResult;
}) {
	const { movieGenreIdList, tvGenreIdList } = useGetGenreIdList();
	console.log("genres here", movieGenreIdList, tvGenreIdList);
	console.log("mediaItem", mediaItem);
	console.log(
		"isMovieDetail or isTvDetail",
		isMovieDetail(mediaItem) || isTvDetail(mediaItem)
	);
	return (
		<div style={{ width: "100%" }}>
			{isMovieDetail(mediaItem) || isTvDetail(mediaItem)
				? formatGenres({ format: " • ", inputObjList: mediaItem.genres })
				: formatGenres({
						format: " • ",
						inputIdList: mediaItem.genre_ids,
						genreIdList:
							mediaItem.media_type === "movie"
								? movieGenreIdList
								: tvGenreIdList,
				  })}
		</div>
	);
}
