const API_KEY = "3a80f7f28c20df567800b2cbc5e55a54";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
	return fetch(
		`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en-US`
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

export function getMovieDetail(movie_id: number) {
	return fetch(
		`${BASE_PATH}/movie/${movie_id}?api_key=${API_KEY}&language=en`
	).then((response) => response.json());
}
