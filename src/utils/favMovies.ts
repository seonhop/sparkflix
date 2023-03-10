interface IFavMovie {
	title: string;
	id: number;
	pos: (number | string)[];
	transform: (number | string)[];
	logoWidth: string;
}

export interface IFavMovieIDs {
	title: string;
	id: number;
	original_language: string;
}

/* {
    title: "Coco",
    id: 354912,
}, */

interface IPosDict {
	[key: string]: (number | string)[];
}

const posDict: IPosDict = {
	topRight: [0, 0, "none", "none"],
	topLeft: [0, "none", "none", 0],
	bottomRight: ["none", 0, 0, "none"],
	bottomLeft: ["none", "none", 0, 0],
};

interface IFavDict {
	[key: string]: IFavMovie;
}

export const favMovieDict: IFavDict = {
	"339403": {
		title: "Baby Driver",
		id: 339403,
		pos: posDict["topRight"],
		transform: ["-10%", "100%"],
		logoWidth: "40%",
	},
	"152601": {
		title: "Her",
		id: 152601,
		pos: posDict["topLeft"],
		transform: ["20%", "60%"],
		logoWidth: "40%",
	},

	"9806": {
		title: "The Incredibles",
		id: 9806,
		pos: posDict["topLeft"],
		transform: ["20%", "20%"],
		logoWidth: "30%",
	},

	"120467": {
		title: "The Grand Budapest Hotel",
		id: 120467,
		pos: posDict["topRight"],
		transform: ["-20%", "10%"],
		logoWidth: "35%",
	},
	"545611": {
		title: "Everything Everywhere All at Once",
		id: 545611,
		pos: posDict["bottomLeft"],
		transform: ["20%", "-50%"],
		logoWidth: "35%",
	},
	"354912": {
		title: "Coco",
		id: 354912,
		pos: posDict["bottomRight"],
		transform: ["-20%", "-40%"],
		logoWidth: "30%",
	},

	"19913": {
		title: "(500) Days of Summer",
		id: 19913,
		pos: posDict["bottomLeft"],
		transform: ["20%", "-30%"],
		logoWidth: "40%",
	},

	"587": {
		title: "Big Fish",
		id: 587,
		pos: posDict["topRight"],
		transform: ["-10%", "10%"],
		logoWidth: "40%",
	},
	"87827": {
		title: "Life of Pi",
		id: 87827,
		pos: posDict["topLeft"],
		transform: ["10%", "200%"],
		logoWidth: "35%",
	},
	"24": {
		title: "Kill Bill: Vol. 1",
		id: 24,
		pos: posDict["bottomRight"],
		transform: ["-10%", "-20%"],
		logoWidth: "50%",
	},
	"238": {
		title: "The Godfather",
		id: 238,
		pos: posDict["topRight"],
		transform: ["-20%", "20%"],
		logoWidth: "25%",
	},
	"361743": {
		title: "Top Gun - Maverick",
		id: 361743,
		pos: posDict["bottomLeft"],
		transform: ["10%", "-40%"],
		logoWidth: "40%",
	},

	"391713": {
		title: "Lady Bird",
		id: 391713,
		pos: posDict["bottomLeft"],
		transform: ["10%", "-40%"],
		logoWidth: "40%",
	},
	"597": {
		title: "Titanic", //Mood Indigo
		id: 597,
		pos: posDict["bottomLeft"],
		transform: ["20%", "-40%"],
		logoWidth: "40%",
	},
	"38": {
		title: "Eternal Sunshine of the Spotless Mind",
		id: 38,
		pos: posDict["topLeft"],
		transform: ["10%", "40%"],
		logoWidth: "65%",
	},
	"274": {
		title: "The Silence of the Lambs",
		id: 274,
		pos: posDict["bottomLeft"],
		transform: ["10%", "-50%"],
		logoWidth: "80%",
	},
	"744": {
		title: "Top Gun",
		id: 744,
		pos: posDict["bottomLeft"],
		transform: ["10%", "-150%"],
		logoWidth: "55%",
	},

	"629": {
		title: "The Usual Suspects",
		id: 629,
		pos: posDict["bottomRight"],
		transform: ["-10%", "-10%"],
		logoWidth: "50%",
	},
	"278": {
		title: "The Shawshank Redemption",
		id: 278,
		pos: posDict["bottomLeft"],
		transform: ["20%", "-3  0%"],
		logoWidth: "70%",
	},

	"4935": {
		title: "Howl's Moving Castle",
		id: 4935,
		pos: posDict["topLeft"],
		transform: ["10%", "40%"],
		logoWidth: "50%",
	},

	"14160": {
		title: "Up",
		id: 14160,
		pos: posDict["bottomLeft"],
		transform: ["4%", "-40%"],
		logoWidth: "46%",
	},

	"398818": {
		title: "Call Me by Your Name",
		id: 398818,
		pos: posDict["topRight"],
		transform: ["-8%", "10%"],
		logoWidth: "50%",
	},
	"8587": {
		title: "The Lion King",
		id: 8587,
		pos: posDict["bottomLeft"],
		transform: ["10%", "-20%"],
		logoWidth: "50%",
	},

	"185": {
		title: "A Clockwork Orange",
		id: 185,
		pos: posDict["bottomRight"],
		transform: ["-10%", "-10%"],
		logoWidth: "50%",
	},
	"122906": {
		title: "About Time",
		id: 122906,
		pos: posDict["bottomLeft"],
		transform: ["20%", "-60%"],
		logoWidth: "45%",
	},
	"194662": {
		title: "Birdman or (The Unexpected Virtue of Ignorance)",
		id: 194662,
		pos: posDict["topLeft"],
		transform: ["20%", "20%"],
		logoWidth: "44%",
	}, //13

	"244786": {
		title: "Whiplash",
		id: 244786,
		pos: posDict["bottomLeft"],
		transform: ["30%", "-40%"],
		logoWidth: "60%",
	},

	"68718": {
		title: "Django Unchained",
		id: 68718,
		pos: posDict["bottomRight"],
		transform: ["-30%", "-30%"],
		logoWidth: "60%",
	},

	"6977": {
		title: "No Country for Old Men",
		id: 6977,
		pos: posDict["bottomRight"],
		transform: ["-10%", "-30%"],
		logoWidth: "45%",
	},
	"423": {
		title: "The Pianist",
		id: 423,
		pos: posDict["bottomLeft"],
		transform: ["10%", "-20%"],
		logoWidth: "40%",
	},
};

export const favMovieIDs: IFavMovieIDs[] = [
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
		title: "Scarface",
		id: 274,
		original_language: "en",
	},
	{
		title: "Top Gun",
		id: 744,
		original_language: "en",
	},

	{
		title: "The Usual Suspects",
		id: 629,
		original_language: "en",
	},
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
		title: "3 Idiots",
		id: 361743,
		original_language: "en",
	},

	{
		title: "The Shawshank Redemption",
		id: 278,
		original_language: "en",
	},

	{
		title: "Loving Vincent",
		id: 339877,
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
];
