import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import rootSaga from "~/store/saga"
import { app, AppStore } from "./app/reducer"

interface RootStoreType {
	app: AppStore
}

export type RootStore = Readonly<RootStoreType>

export function makeStore() {
	const sagaMiddleware = createSagaMiddleware()
	const store = configureStore({
		reducer: {
			app,
		},
		middleware: [sagaMiddleware],
		devTools: import.meta.env.MODE === "development" ? { name: "frontend" } : false,
	})

	sagaMiddleware.run(rootSaga)

	return store
}

export const store = makeStore()
