import { Route } from "react-router-dom"

export const FormRoutes = <Route path="form" lazy={() => import("./FormPage")} />
