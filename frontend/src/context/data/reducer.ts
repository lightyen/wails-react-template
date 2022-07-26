import { createReducer } from "@reduxjs/toolkit"
import { AxiosError } from "axios"
import { dataError, dataLoading, dataSuccess, isMountAction, isUnmountAction } from "./action"

export interface DataCache<Data = unknown> {
	mount: boolean
	loading: boolean
	url: string
	data?: Data
	error?: AxiosError
}

export interface DataStore {
	[key: string]: DataCache
}

const init: DataStore = {}

export const data = createReducer(init, builder =>
	builder
		.addCase(dataSuccess, (state, { payload: { key, data } }) => {
			const cache = state[key]
			if (cache != undefined) {
				state[key].data = data
				state[key].error = undefined
				state[key].loading = false
			}
		})
		.addCase(dataError, (state, { payload: { key, error } }) => {
			const cache = state[key]
			if (cache != undefined) {
				state[key].data = undefined
				state[key].error = error
				state[key].loading = false
			}
		})
		.addCase(dataLoading, (state, { payload: { key } }) => {
			const cache = state[key]
			if (cache != undefined) {
				state[key].loading = true
			}
		})
		.addMatcher(isMountAction, (state, { payload: { key, url } }) => {
			const cache = state[key]
			if (cache == undefined) {
				state[key] = { mount: true, url, loading: false }
			} else {
				state[key].mount = true
			}
		})
		.addMatcher(isUnmountAction, (state, { payload: { key } }) => {
			const cache = state[key]
			if (cache != undefined) {
				state[key].mount = false
			}
		}),
)
