import { PropsWithChildren } from "react"
import { Provider as ReactReduxProvider } from "react-redux"
import { AppStoreContext } from "./hooks"
import { store } from "./store"

export function StoreProvider({ children }: PropsWithChildren<{}>) {
	return (
		<ReactReduxProvider context={AppStoreContext} store={store}>
			{children}
		</ReactReduxProvider>
	)
}
