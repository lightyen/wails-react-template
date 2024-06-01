import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { Layout } from "./layout"
import { ComponentRoutes, Components } from "./pages/Components"
import { Home } from "./pages/Home"
import { NotFound } from "./pages/NotFound"
import { TablePage } from "./pages/Table"
import { TodoList } from "./pages/Todolist"

const root = "/"

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path={root} Component={Layout}>
			<Route index Component={Home} />
			<Route path="*" Component={NotFound} />
			<Route path="components" Component={Components} />
			{ComponentRoutes}
			<Route path="table" Component={TablePage} />
			<Route path="todolist" Component={TodoList} />
		</Route>,
	),
)
