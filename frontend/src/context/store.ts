import { configureStore, Tuple } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import { app, type AppStore } from "./app/reducer"
import { data, type DataStore } from "./data/reducer"
import { intl, type IntlStore } from "./intl/reducer"
import rootSaga from "./saga"

interface RootStoreType {
	app: AppStore
	data: DataStore
	intl: IntlStore
}

export type RootStore = Readonly<RootStoreType>

export function createStore() {
	const sagaMiddleware = createSagaMiddleware()
	const store = configureStore({
		reducer: {
			app,
			data,
			intl,
		},
		middleware: () => new Tuple(sagaMiddleware),
		devTools: import.meta.env.MODE === "development" ? { name: "frontend" } : false,
	})

	sagaMiddleware.run(rootSaga)
	return store
}

export const store = createStore()
