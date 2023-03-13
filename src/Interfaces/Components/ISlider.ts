import { IGetMovieImagesResult } from "../API/IGetImages";
import { IGetMovieDetailResult } from "../API/IGetDetails/IGetMovieDetail";
import { IGetCredits } from "../API/IGetCredits";
import { IGetResult } from "../API/IGetResults";
export type ISliderBtnPos = "left" | "right";
import { Cast } from "../API/IGetCredits";
import { ReviewResults } from "../API/IGetReviews";
import { IGetTvDetailResult } from "../API/IGetDetails/IGetTvDetails";
import { SearchResult } from "../API/IGetSearchResults";

export interface IHeroSlider {
	heroMovieImages: IGetMovieImagesResult[];
	heroMovieDetails: IGetMovieDetailResult[];
}

export interface ISlider {
	forCast?: { data: Cast[]; movieId: string };
	forReview?: { data: ReviewResults[]; movieId: string };
	imageData?: IGetMovieImagesResult[] | undefined;
	detailData?: IGetMovieDetailResult[] | IGetTvDetailResult[] | SearchResult[];
	wrapperMargin?: number;
	sliderType: string;
	inBigMovie: boolean;
	mediaType: string;
	offset?: number;
	path?: string;
	onClick?: (id: string, mediaType: string, path?: string) => void;
}

export interface IPopularSlider {
	imageData: IGetMovieImagesResult[] | undefined;
	detailData: IGetResult;
	wrapperMargin?: number;
}
