import { Route } from "react-router-dom"

export const TableRoutes = <Route path="table" lazy={() => import("./Table")} />
