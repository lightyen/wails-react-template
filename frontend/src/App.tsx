import "@concepts/theme"
import { LocaleProvider, StoreProvider } from "@context/Provider"
import { Global, css } from "@emotion/react"
import { RouterProvider } from "react-router-dom"
import { globalStyles, tw } from "twobj"
import { router } from "./Router"
import "./global.css"

const bodyScrollbar = tw`not-mobile:(
	[@supports selector(::-webkit-scrollbar)]:(
		[::-webkit-scrollbar]:(w-[7px] h-[7px])
		hover:[::-webkit-scrollbar-thumb]:bg-foreground/20
		[::-webkit-scrollbar-thumb]:(bg-muted bg-clip-content hover:bg-foreground/25)
	)
)`

const appStyle = css`
	${bodyScrollbar}
	body {
		${tw`
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
