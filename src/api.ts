const API_KEY = "3a80f7f28c20df567800b2cbc5e55a54";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
	return fetch(
		`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

export function getPopular() {
	return fetch(
		`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

export function getVideos(movie_id: number) {
	return fetch(
		`${BASE_PATH}/movie/${movie_id}/videos?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

export function getImages(movie_id: number) {
	return fetch(
		`${BASE_PATH}/movie/${movie_id}/images?api_key=${API_KEY}&language=en&include_image_language=en,null`
	).then((response) => response.json());
}

export function getCredits(movie_id: number) {
	return fetch(
		`${BASE_PATH}/movie/${movie_id}/credits?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

export function getReviews(movie_id: number) {
	return fetch(
		`${BASE_PATH}/movie/${movie_id}/reviews?api_key=${API_KEY}&language=en-US`
	).then((response) => response.json());
}

export function getMovieDetail(movie_id: number) {
	return fetch(
		`${BASE_PATH}/movie/${movie_id}?api_key=${API_KEY}&language=en`
	).then((response) => response.json());
}

export function getSearchResults(query: string) {
	return fetch(
		`${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${query}`
	).then((response) => response.json());
}
