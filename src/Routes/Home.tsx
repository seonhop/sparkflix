import styled from "styled-components";
import { useQuery } from "react-query";
import { getMovies, getMovieDetail, getImages } from "../api";
import { IGetMoviesResult } from "../Interfaces/API/IGetMovies";
import { IGetImagesResult } from "../Interfaces/API/IGetImages";
import { makeImagePath } from "../utils";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 200vh;
`;

const Span = styled.span`
	display: block;
	padding: 200px;
`;

const Loader = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 20vh;
`;

const Hero = styled.div<{ bgPhoto: string }>`
	display: flex;
	height: 100vh;
	width: 100%;
	justify-content: center;
	align-items: flex-start;
	flex-direction: column;
	padding: 0 3.5rem;
	gap: 2rem;

	background-image: linear-gradient(to right, #000, rgba(0, 0, 0, 0), #000),
		linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)),
		url(${(props) => props.bgPhoto});
	background-size: cover;
`;

const HeroTitle = styled.img`
	width: 35%;
`;

const HeroInfoContainer = styled.div`
	display: flex;
`;

const HeroOverview = styled.p`
	font-size: 1.1rem;
	width: 35%;
	line-height: 1.25;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	overflow: hidden;
	text-overflow: ellipsis;
`;

function Home() {
	const { data: getMoviesResult, isLoading } = useQuery<IGetMoviesResult>(
		["movies", "nowPlaying"],
		getMovies
	);
	const { data: highestRatingMovieImages, isLoading: isImagesLoading } =
		useQuery<IGetImagesResult>(
			["images", "highestRatingMovie"],
			() => {
				const highestRatingMovie = getMoviesResult?.results.reduce(
					(prev, current) => {
						return prev.vote_count > current.vote_count ? prev : current;
					}
				);

				return getImages(highestRatingMovie?.id || 0);
			},
			{
				enabled: !!getMoviesResult?.results, // Only run if getMoviesResult has data
			}
		);

	const highestRatingMovie = getMoviesResult?.results.reduce(
		(highest, current) => {
			if (current.vote_average > highest.vote_average) {
				return current;
			} else {
				return highest;
			}
		}
	);
	console.log(highestRatingMovieImages);

	return (
		<Container>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<Hero
						bgPhoto={makeImagePath(
							highestRatingMovieImages?.backdrops[0].file_path || ""
						)}
					>
						<HeroTitle
							src={makeImagePath(
								highestRatingMovieImages?.logos[0].file_path || ""
							)}
						/>
						<HeroOverview>{highestRatingMovie?.overview}</HeroOverview>
					</Hero>
				</>
			)}
		</Container>
	);
}

export default Home;
