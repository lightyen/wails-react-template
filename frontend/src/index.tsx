import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { GlobalStyles } from "./GlobalStyles"

const rootEl = document.getElementById("root")

if (rootEl) {
	const root = createRoot(rootEl)
	root.render(
		<StrictMode>
			<GlobalStyles />
			<App />
		</StrictMode>,
	)
}
