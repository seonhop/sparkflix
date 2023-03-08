import { IGetImagesResult } from "../API/IGetImages";
import { IGetMovieDetailResult } from "../API/IGetMovieDetail";
import { IGetCredits } from "../API/IGetCredits";
export type ISliderBtnPos = "left" | "right";

export interface IHeroSlider {
	heroMovieImages: IGetImagesResult[];
	heroMovieDetails: IGetMovieDetailResult[];
}

export interface ISlider {
	imageData: IGetImagesResult[];
	detailData: IGetMovieDetailResult[];
	wrapperMargin?: number;
}
