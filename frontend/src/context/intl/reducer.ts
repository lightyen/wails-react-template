import { createReducer } from "@reduxjs/toolkit"
import { setLocale } from "./action"
import { getLocale, storeLocale } from "./languages"

interface IntlStoreType {
	locale: string
}

export type IntlStore = Readonly<IntlStoreType>

const [locale] = getLocale()

const init: IntlStore = {
	locale: locale,
}

export const intl = createReducer(init, builder =>
	builder.addCase(setLocale, (state, { payload }) => {
		storeLocale(payload)
		state.locale = payload
	}),
)
