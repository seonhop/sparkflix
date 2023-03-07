import { IGetImagesResult } from "../API/IGetImages";

export type ISliderBtnPos = "left" | "right";

export interface IHeroSlider {
	heroMovieImages: IGetImagesResult[];
}
