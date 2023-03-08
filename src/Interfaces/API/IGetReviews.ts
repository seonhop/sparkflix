export interface IGetReviews {
	id: number;
	page: number;
	results: ReviewResults[];
	total_pages: number;
	total_results: number;
}

export interface ReviewResults {
	author: string;
	author_details: AuthorDetails;
	content: string;
	created_at: Date;
	id: string;
	updated_at: Date;
	url: string;
}

interface AuthorDetails {
	name: string;
	username: string;
	avatar_path: null | string;
	rating: number | null;
}
