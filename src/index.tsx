import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "styled-components";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import router from "./Router";
import { theme } from "./theme";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient();

root.render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider theme={theme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	</QueryClientProvider>
);
