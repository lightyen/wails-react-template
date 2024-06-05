import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { Layout } from "./layout"
import { ComponentRoutes } from "./pages/Component"
import { FormRoutes } from "./pages/Form"
import { Home } from "./pages/Home"
import { NotFound } from "./pages/NotFound"
import { TableRoutes } from "./pages/Table"

const root = "/"

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path={root} Component={Layout}>
			<Route index Component={Home} />
			<Route path="*" Component={NotFound} />
			{ComponentRoutes}
			{FormRoutes}
			{TableRoutes}
		</Route>,
	),
)
