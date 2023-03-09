export const OFF_SET = 6;
export const SPIDERMAN_ID = 324857; //569094 324857
export const SLIDER_MARGIN = -window.innerHeight * 0.05;
export const NETFLIX_LOGO_URL =
	"https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";

interface ENDPOINT_DICT_PARAMS {
	endpoint: string;
	requiresId: boolean;
}

interface IENDPOINT_DICT {
	[key: string]: ENDPOINT_DICT_PARAMS;
}

export const ENDPOINT_DICT: IENDPOINT_DICT = {
	topRated: { endpoint: "top_rated", requiresId: false },
	popular: { endpoint: "popular", requiresId: false },
	nowPlaying: { endpoint: "now_playing", requiresId: false },
	onAir: { endpoint: "on_the_air", requiresId: false },
	recommends: { endpoint: "{media_id}/recommendations", requiresId: true },
	videos: { endpoint: "{media_id}/videos", requiresId: true },
	images: { endpoint: "{media_id}/images", requiresId: true },
	credits: { endpoint: "{media_id}/credits", requiresId: true },
	details: { endpoint: "{media_id}", requiresId: true },
	reviews: { endpoint: "{media_id}/reviews", requiresId: true },
};
