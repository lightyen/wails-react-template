import "@concepts/theme"
import { LocaleProvider, StoreProvider } from "@context/Provider"
import { Global, css } from "@emotion/react"
import { RouterProvider } from "react-router-dom"
import { globalStyles, tx } from "twobj"
import { router } from "./Router"
import "./global.css"

const bodyScrollbar = tx`not-mobile:(
	[::-webkit-scrollbar]:(w-[7px] h-[7px])
	[::-webkit-scrollbar-thumb]:(
		bg-foreground/15 hover:bg-foreground/20 bg-clip-content
	)
)`

const appStyle = css`
	${bodyScrollbar}
	body {
		${tx`
			overflow-hidden
			bg-background text-foreground font-normal leading-normal font-sans
			m-0 min-w-[320px] min-h-screen
		`}
	}
`

export function App() {
	return (
		// <StrictMode>
		<StoreProvider>
			<Global styles={[globalStyles, appStyle]} />
			<LocaleProvider>
				<RouterProvider router={router} />
			</LocaleProvider>
		</StoreProvider>
		// </StrictMode>
	)
}
