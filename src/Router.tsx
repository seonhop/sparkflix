import { create } from "domain";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import MovieModal from "./Components/MovieModal";
import TvModal from "./Components/TvModal";

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <App />,
			children: [
				{
					path: "",
					element: <Home />,
					children: [
						{
							path: "/movies/:movieId",
							element: <MovieModal />,
						},
					],
				},

				{
					path: "/tv",
					element: <Tv />,
					children: [
						{
							path: "/tv/:tvId",
							element: <TvModal />,
						},
					],
				},
				{
					path: "/search",
					element: <Search />,
					children: [
						{
							path: "/search/tv/:tvId?",
							element: <TvModal />,
						},
						{
							path: "/search/movies/:movieId?",
							element: <MovieModal />,
						},
					],
				},
			],
		},
	],
	{ basename: process.env.PUBLIC_URL }
);

export default router;
