import { type } from "os";

export const API_KEY = "3a80f7f28c20df567800b2cbc5e55a54";
export const BASE_PATH = "https://api.themoviedb.org/3";
export const OFF_SET = 6;
export const HERO_ID = 313369; //569094 324857 843 198375 120467  475557 122906  313369 (lala) 705996 (decision to leave)
export const HERO_TV_ID = 110382; // 112486 110382 75820
export const SLIDER_MARGIN = -window.innerHeight * 0.05;
export const NETFLIX_LOGO_URL =
	"https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4";
export const NETFLIX_BLACK_URL =
	"https://www.edigitalagency.com.au/wp-content/uploads/Netflix-logo-red-black-png.png";
export const NETFLIX_LOGO_BLACK_URL =
	"https://cdn.vox-cdn.com/thumbor/7OwmIhJ3941BJ3q_TkhfInKfSmo=/0x0:3840x2560/1200x800/filters:focal(1613x973:2227x1587)/cdn.vox-cdn.com/uploads/chorus_image/image/70590778/netflix_n_icon_logo_3840.0.jpg";

export enum QueryMediaType {
	movie = "movie",
	tv = "tv",
}

export enum Endpoint {
	topRated = "/top_rated",
	popular = "/popular",
	nowPlaying = "/now_playing",
	onAir = "/on_the_air",
	airingToday = "/airing_today",
	discover = "/discover",

	recommends = "/recommendations",
	videos = "/videos",
	images = "/images",
	credits = "/credits",
	details = "",
	reviews = "/reviews",
	seasons = "/season/{season_num}",
	search = "/search/multi",
}

export enum TvGenreIds {
	action_adventure = "10759",
	animation = "16",
	comedy = "35",
	crime = "80",
	documentary = "99",
	drama = "18",
	family = "10751",
	kids = "10762",
	mystery = "9648",
	news = "10763",
	reality = "10764",
	scifi_fantasy = "10765",
	soap = "10766",
	talk = "10767",
	war_politics = "10768",
	western = "37",
}

export enum MovieGenreIds {
	action = "28",
	adventure = "12",
	animation = "16",
	comedy = "35",
	crime = "80",
	documentary = "99",
	drama = "18",
	family = "10751",
	fantasy = "14",
	history = "36",
	horror = "27",
	music = "10402",
	mystery = "9648",
	romance = "10749",
	science_fiction = "878",
	tv_movie = "10770",
	thriller = "53",
	war = "10752",
	western = "37",
}

export interface IGenreIdResult {
	genres: { id: number; name: string }[];
}

export interface IFavMovieIDs {
	title: string;
	id: number;
	original_language: string;
}

export interface IFavMovie {
	results: IFavMovieIDs[];
}

export const favMovies: IFavMovie = {
	results: [
		{
			title: "Her",
			id: 152601,
			original_language: "en",
		},
		{
			title: "In the Mood for Love",
			id: 843,
			original_language: "cn",
		},

		{
			title: "The Incredibles",
			id: 9806,
			original_language: "en",
		},

		{
			title: "The Grand Budapest Hotel",
			id: 120467,
			original_language: "en",
		},

		{
			title: "Everything Everywhere All at Once",
			id: 545611,
			original_language: "en",
		},
		{
			title: "Coco",
			id: 354912,
			original_language: "en",
		},

		{
			title: "(500) Days of Summer",
			id: 19913,
			original_language: "en",
		},

		{
			title: "Big Fish",
			id: 587,
			original_language: "en",
		},
		{
			title: "Life of Pi",
			id: 87827,
			original_language: "en",
		},
		{
			title: "Kill Bill: Vol. 1",
			id: 24,
			original_language: "en",
		},
		{
			title: "The Godfather",
			id: 238,
			original_language: "en",
		},
		{
			title: "Top Gun",
			id: 361743,
			original_language: "en",
		},
		{
			title: "Lady Bird",
			id: 391713,
			original_language: "en",
		},
		{
			title: "Titanic", //Mood Indigo
			id: 597,
			original_language: "en",
		},
		{
			title: "Eternal Sunshine of the Spotless Mind",
			id: 38,
			original_language: "en",
		},
		{
			title: "The Silence of the Lambs",
			id: 274,
			original_language: "en",
		},
		{
			title: "Mood Indigo",
			id: 157820,
			original_language: "en",
		},

		{
			title: "Ford v Ferrari", //The Usual Suspects
			id: 359724, // 629
			original_language: "en",
		},

		{
			title: "The Shawshank Redemption",
			id: 278,
			original_language: "en",
		},
		{
			title: "Darling Unlimited",
			id: 4538,
			original_language: "en",
		},

		{
			title: "Up",
			id: 14160,
			original_language: "en",
		},

		{
			title: "Call Me by Your Name",
			id: 398818,
			original_language: "en",
		},
		{
			title: "The Lion King",
			id: 8587,
			original_language: "en",
		},

		{
			title: "A Clockwork Orange",
			id: 185,
			original_language: "en",
		},
		{
			title: "About Time",
			id: 122906,
			original_language: "en",
		},
		{
			title: "Birdman or (The Unexpected Virtue of Ignorance)",
			id: 194662,
			original_language: "en",
		}, //13

		{
			title: "Whiplash",
			id: 244786,
			original_language: "en",
		},

		{
			title: "Django Unchained",
			id: 68718,
			original_language: "en",
		},

		{
			title: "No Country for Old Men",
			id: 6977,
			original_language: "en",
		},
		{
			title: "The Pianist",
			id: 423,
			original_language: "en",
		},

		/* {
			title: "Pulp Fiction",
			id: 680,
		},
	
		{
			title: "The Godfather Part II",
			id: 240,
		},
	
		{
			title: "Spirited Away",
			id: 129,
		},
		{
			title: "The Shining",
			id: 694,
		},
		{
			title: "Joker",
			id: 475557,
		},
		{
			title: "Parasite",
			id: 496243,
		},
		{
			title: "The Fall",
			id: 14784
		},
		{
			title: "The Garden of Words",
			id: 198375
		},
		{
			title: "La La Land",
			id: 313369
		}
		
		*/
	],
};
