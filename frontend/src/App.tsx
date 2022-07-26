import { ThemeProvider } from "@emotion/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren } from "react"
import { StoreProvider } from "~/store/Provider"
import { Main } from "./Main"
import { useSelect } from "./store"

function ReactQueryProvider({ children }: PropsWithChildren<{}>) {
	const queryClient = useSelect(state => state.app.queryClient)
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default function App() {
	return (
		<StoreProvider>
			<ReactQueryProvider>
				<ThemeProvider theme={{}}>
					<Main />
				</ThemeProvider>
			</ReactQueryProvider>
		</StoreProvider>
	)
}
