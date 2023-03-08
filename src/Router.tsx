import { create } from "domain";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import MovieModal from "./Components/MovieModal";

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
				},
				{
					path: "/search",
					element: <Search />,
				},
			],
		},
	],
	{ basename: process.env.PUBLIC_URL }
);

export default router;
