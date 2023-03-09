import { IGetImagesResult } from "../API/IGetImages";
import { IGetMovieDetailResult } from "../API/IGetMovieDetail";
import { IGetCredits } from "../API/IGetCredits";
import { IGetResult } from "../API/IGetResults";
export type ISliderBtnPos = "left" | "right";

export interface IHeroSlider {
	heroMovieImages: IGetImagesResult[];
	heroMovieDetails: IGetMovieDetailResult[];
}

export interface ISlider {
	imageData: IGetImagesResult[] | undefined;
	detailData: IGetMovieDetailResult[];
	wrapperMargin?: number;
	sliderType: string;
}

export interface IPopularSlider {
	imageData: IGetImagesResult[] | undefined;
	detailData: IGetResult;
	wrapperMargin?: number;
}

interface DetailData extends IGetMovieDetailResult {
	dataType: "movieDetail";
}

interface PopularData extends IGetResult {
	dataType: "popular";
}

type DetailOrPopularData = DetailData | PopularData;
