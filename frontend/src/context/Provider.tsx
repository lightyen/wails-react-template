import { PropsWithChildren } from "react"
import { IntlProvider } from "react-intl"
import { Provider as ReactReduxProvider } from "react-redux"
import { AppStoreContext, useSelect } from "./hooks"
import { getLocale } from "./intl/languages"
import { store } from "./store"

export function StoreProvider({ children }: PropsWithChildren<{}>) {
	return (
		<ReactReduxProvider context={AppStoreContext} store={store}>
			{children}
		</ReactReduxProvider>
	)
}

export function LocaleProvider({ children }: PropsWithChildren<{}>) {
	const locale = useSelect(state => state.intl.locale)
	const [, messages] = getLocale()
	return (
		<IntlProvider locale={locale} key={locale} messages={messages}>
			{children}
		</IntlProvider>
	)
}
