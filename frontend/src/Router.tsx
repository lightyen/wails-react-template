import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { Layout } from "./layout"
import { ComponentRoutes, Components } from "./pages/Components"
import { Home } from "./pages/Home"
import { NotFound } from "./pages/NotFound"
import { Table } from "./pages/Table"
import { Todolist } from "./pages/Todolist"

const root = "/"

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path={root} Component={Layout}>
			<Route index Component={Home} />
			<Route path="*" Component={NotFound} />
			<Route path="components" Component={Components} />
			{ComponentRoutes}
			<Route path="table" Component={Table} />
			<Route path="todolist" Component={Todolist} />
		</Route>,
	),
)
