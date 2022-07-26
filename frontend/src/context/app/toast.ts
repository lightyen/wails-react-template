import { type Task } from "redux-saga"
import { cancelled, delay, fork, put, takeEvery } from "redux-saga/effects"
import * as ac from "./action"

export const TOAST_LIMIT = 3

let count = 0

export function genToastId() {
	count = (count + 1) % Number.MAX_VALUE
	return count.toString()
}

export function* toast() {
	interface ToastTask {
		delay: number
		task: Task<void>
		removed?: boolean
	}

	const toastTasks: Map<string, ToastTask> = new Map()

	function* dismiss({ id, delay: d }: ac.InnerToasterToast) {
		try {
			yield delay(d)
			yield put(ac.dismissToast(id))
		} finally {
			if (yield cancelled()) {
				// nothing.
			}
		}
	}

	yield takeEvery(ac.isAddToastAction, function* ({ payload }) {
		const { title, description, action, variant, ...toast } = payload
		if (toastTasks.size >= TOAST_LIMIT) {
			for (const [id, t] of toastTasks) {
				if (t.removed) {
					continue
				}
				if (t.task.isRunning()) t.task.cancel()
				yield put(ac.dismissToast(id))
				t.removed = true
				break
			}
		}
		const t = toastTasks.get(toast.id)
		if (t) {
			t.task.cancel()
		}
		const task: Task<void> = yield fork(dismiss, toast)
		if (toast.delay === 0) task.cancel()
		toastTasks.set(toast.id, { task, ...toast })
	})
	yield takeEvery(ac.dismissToast, function* ({ payload: id }) {
		const t = toastTasks.get(id)
		if (t) {
			t.task.cancel()
		}
		toastTasks.delete(id)
		yield
	})
	yield takeEvery(ac.restartDismissToast, function* ({ payload: id }) {
		const t = toastTasks.get(id)
		if (t) {
			t.task.cancel()

			const task: Task<void> = yield fork(function* () {
				try {
					yield delay(t.delay)
					yield put(ac.dismissToast(id))
				} finally {
					if (yield cancelled()) {
						// nothing.
					}
				}
			})
			if (t.delay === 0) task.cancel()
			const { task: _, ...payload } = t
			toastTasks.set(id, { task, ...payload })
		}
		yield
	})
	yield takeEvery(ac.cancelDismissToast, function* ({ payload: id }) {
		const t = toastTasks.get(id)
		if (t) {
			t.task.cancel()
		}
		yield
	})
}
