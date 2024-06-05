import { Route } from "react-router-dom"

export const ComponentRoutes = (
	<Route path="components" lazy={() => import("./ComponentPage")}>
		<Route index lazy={() => import("./tabs/Preview")} />
		<Route path="preview" lazy={() => import("./tabs/Preview")} />
		<Route path="tab2" loader={() => 2} lazy={() => import("./tabs/TabDemo")} />
		<Route path="tab3" loader={() => 3} lazy={() => import("./tabs/TabDemo")} />
		<Route path="tab4" loader={() => 4} lazy={() => import("./tabs/TabDemo")} />
		<Route path="tab5" loader={() => 5} lazy={() => import("./tabs/TabDemo")} />
		<Route path="tab6" loader={() => 6} lazy={() => import("./tabs/TabDemo")} />
	</Route>
)
