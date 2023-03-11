export const API_KEY = "3a80f7f28c20df567800b2cbc5e55a54";
export const BASE_PATH = "https://api.themoviedb.org/3";

export function fetchData(
	endpoint: string,
	mediaType: "movie" | "tv",
	id?: number,
	originalLanguage?: string,
	seasonNum?: number,
	genre?: string,
	originalCountry?: string
) {
	let url = `${BASE_PATH}/${mediaType}`;
	let language = "en";
	let country = "en";
	let defaultSeasonNum = 1;

	if (id) {
		url += `/${id}`;
	}
	if (originalLanguage) {
		language = originalLanguage;
	}
	if (originalCountry) {
		country = originalCountry;
	}
	if (seasonNum) {
		defaultSeasonNum = seasonNum;
	}
	console.log(endpoint, endpoint.includes("{season_num}"));

	if (endpoint.includes("{season_num}")) {
		endpoint = endpoint.replace("{season_num}", defaultSeasonNum + "");
	}
	console.log(endpoint, endpoint.includes("{season_num}"));

	url += `${endpoint}?api_key=${API_KEY}&language=en`;
	if (endpoint === "/images") {
		url += `&include_image_language=en,null`;
	}
	if (mediaType === "tv" && !id) {
		url += `&with_original_language=${country}`;
	}
	if (genre) {
		url += `&with_genres=${genre}`;
	}

	console.log("api url", url);
	return fetch(url).then((response) => response.json());
}

export function getData(mediaType?: string) {
	return fetch(
		`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

export function getPopular(mediaType?: string) {
	return fetch(
		`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

export function getTopRated(mediaType?: string) {
	return fetch(
		`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

//clear
export function getNowPlaying() {
	return fetch(
		`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

//clear
export function getAiringToday() {
	return fetch(
		`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

//clear
export function getOnTheAir() {
	return fetch(
		`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

//clear
export function getRecommends(id: number, mediaType?: string) {
	return fetch(
		`${BASE_PATH}/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

export function getVideos(id: number, mediaType?: string) {
	return fetch(
		`${BASE_PATH}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

//clear
export function getImages(
	id: number,
	original_language: string,
	mediaType?: string
) {
	return fetch(
		`${BASE_PATH}/movie/${id}/images?api_key=${API_KEY}&language=${original_language}&include_image_language=null,${original_language}`
	).then((response) => response.json());
}

//clear
export function getCredits(id: number, mediaType?: string) {
	return fetch(
		`${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

//clear
export function getReviews(id: number, mediaType?: string) {
	return fetch(
		`${BASE_PATH}/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

//clear
export function getDetail(
	id: number,
	original_language: string,
	mediaType?: string
) {
	const url = `${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=${original_language}`;
	console.log("detail", url);
	return fetch(url).then((response) => response.json());
}

export function getSearchResults(query: string) {
	return fetch(
		`${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${query}`
	).then((response) => response.json());
}
