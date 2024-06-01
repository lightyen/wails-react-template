import { type RootStore } from "@context"
import { createContext, useEffect, useMemo } from "react"
import {
	ReactReduxContextValue,
	TypedUseSelectorHook,
	createDispatchHook,
	createSelectorHook,
	createStoreHook,
} from "react-redux"
import { bindActionCreators } from "redux"
import app from "./app/action"
import data from "./data/action"
import { type DataCache } from "./data/reducer"
import intl from "./intl/action"

export const AppStoreContext = createContext<ReactReduxContextValue<RootStore> | null>(null)
export const useStore = createStoreHook(AppStoreContext)
export const useDispatch = createDispatchHook(AppStoreContext)
export const useSelect: TypedUseSelectorHook<RootStore> = createSelectorHook(AppStoreContext)

export function useAction() {
	const dispatch = useDispatch()
	return useMemo(
		() => ({
			app: bindActionCreators(app, dispatch),
			data: bindActionCreators(data, dispatch),
			intl: bindActionCreators(intl, dispatch),
		}),
		[dispatch],
	)
}

export function useToast() {
	const { toast, dismissToast } = useAction().app
	return { toast, dismiss: dismissToast }
}

export function useData<Data = object>(key: string, url: string) {
	const { mountData, unmountData } = useAction().data
	const cacheData = useSelect(state => state.data[key]) as DataCache<Data> | undefined
	useEffect(() => {
		mountData(key, url)
		return () => {
			unmountData(key)
		}
	}, [mountData, unmountData, key, url])
	return cacheData ?? {}
}
