import { AnimatePresence } from "framer-motion";
import {
	useNavigate,
	useMatch,
	PathMatch,
	useOutletContext,
} from "react-router-dom";
import { favMovieDict } from "../favMovies";
import styled from "styled-components";
import { motion, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { IGetMovieDetailResult } from "../Interfaces/API/IGetMovieDetail";
import { useQuery } from "react-query";
import { getMovieDetail } from "../api";

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
	z-index: 3;
`;

const BigMovie = styled(motion.div)`
	position: absolute;
	width: 40vw;
	height: 80vh;
	left: 0;
	right: 0;
	margin: 0 auto;
	border-radius: 15px;
	overflow: hidden;
	background-color: ${(props) => props.theme.black.lighter};
	z-index: 4;
`;

const BigCover = styled.div`
	width: 100%;
	background-size: cover;
	background-position: center center;
	height: 400px;
`;

const BigTitle = styled.h3`
	color: ${(props) => props.theme.white.lighter};
	padding: 20px;
	font-size: 46px;
	position: relative;
	top: -80px;
`;

const BigOverview = styled.p`
	padding: 20px;
	position: relative;
	top: -80px;
	color: ${(props) => props.theme.white.lighter};
`;

function MovieModal() {
	const moviePathMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
	const clickedMovieId = moviePathMatch?.params.movieId;
	const { data: movieDetailResult } = useQuery<IGetMovieDetailResult>(
		["movieDetailResult", clickedMovieId],
		() => getMovieDetail(Number(clickedMovieId))
	);

	const clickedMovie = moviePathMatch?.params.movieId && movieDetailResult;

	const { scrollY } = useScroll();
	const navigate = useNavigate();
	const onOverlayClick = () => navigate("/");

	//favMovieDict[+moviePathMatch?.params.movieId];
	return (
		<>
			<AnimatePresence>
				{moviePathMatch ? (
					<>
						<Overlay
							onClick={onOverlayClick}
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						/>
						<BigMovie
							style={{ top: scrollY.get() + 100 }}
							layoutId={moviePathMatch?.params.movieId}
						>
							{clickedMovie && (
								<>
									<BigCover
										style={{
											backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
												clickedMovie.backdrop_path,
												"w500"
											)})`,
										}}
									/>
									<BigTitle>{clickedMovie.original_title}</BigTitle>
									<BigOverview>{clickedMovie.overview}</BigOverview>
								</>
							)}
						</BigMovie>
					</>
				) : null}
			</AnimatePresence>
		</>
	);
}

export default MovieModal;
