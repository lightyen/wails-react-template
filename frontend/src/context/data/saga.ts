import type { RootStore } from "@context"
import { windowEvents } from "@context/events"
import axios, { AxiosResponse } from "axios"
import { call, fork, put, select, takeEvery } from "redux-saga/effects"
import { dataError, dataLoading, dataSuccess, isInvalidateAction, isMountAction } from "./action"
import type { DataStore } from "./reducer"

function* fetchData(key: string, url: string) {
	try {
		yield put(dataLoading(key))
		const resp: AxiosResponse = yield call(axios.get, url)
		yield put(dataSuccess(key, resp.data))
	} catch (error) {
		if (axios.isAxiosError(error)) {
			yield put(dataError(key, error))
		}
	}
}

export default function* data() {
	yield takeEvery(windowEvents("visibilitychange"), function* () {
		const visible = document.visibilityState === "visible"
		if (!visible) {
			return
		}
		const dataStore: DataStore = yield select((state: RootStore) => state.data)
		for (const key in dataStore) {
			const cache = dataStore[key]
			if (cache == null || !cache.mount) {
				continue
			}
			yield fork(fetchData, key, cache.url)
		}
	})
	yield takeEvery(isInvalidateAction, function* ({ payload: { key } }) {
		const dataStore: DataStore = yield select((state: RootStore) => state.data)
		const cache = dataStore[key]
		if (cache == null || !cache.mount) {
			return
		}
		yield fork(fetchData, key, cache.url)
	})
	yield takeEvery(isMountAction, function* ({ payload: { key, url } }) {
		yield fork(fetchData, key, url)
	})
}
