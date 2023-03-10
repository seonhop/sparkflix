import { type } from "os";

export const OFF_SET = 6;
export const HERO_ID = 313369; //569094 324857 843 198375 120467  475557 122906  313369
export const HERO_TV_ID = 110382; // 112486 110382 75820
export const SLIDER_MARGIN = -window.innerHeight * 0.05;
export const NETFLIX_LOGO_URL =
	"https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";

export enum Endpoint {
	topRated = "/top_rated",
	popular = "/popular",
	nowPlaying = "/now_playing",
	onAir = "/on_the_air",
	airingToday = "/airing_today",

	recommends = "/recommendations",
	videos = "/videos",
	images = "/images",
	credits = "/credits",
	details = "",
	reviews = "/reviews",
}

export enum TvGenreIds {
	drama = 18,
	reality = 10764,
	animation = 16,
	scifi_fantasy = 10765,
	action_adventure = 10759,
	mystery = 9648,
	talk = 10767,
}
