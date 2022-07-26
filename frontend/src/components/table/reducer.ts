import { CheckboxAction, type TableAction } from "./action"
import type { FilterState, SortType, TableColumnItem } from "./model"

export interface GlobalSearchContext {
	value: string
	setValue(value: string | ((prev: string) => string)): void
	clearValue(): void
}

export interface TableContext<T extends {} = {}> {
	columns: TableColumnItem<T>[]
	filters: Record<string, FilterState<T>>

	/** base index 0 */
	pageIndex: number
	setPageIndex(i: number | ((prev: number) => number)): void

	/** @default 10 */
	size: number
	setSize(s: number): void

	globalSearch: GlobalSearchContext
}

export const reducer = <T extends {}>(state: TableContext<T>, action: TableAction<T>) => {
	switch (action.type) {
		case "toggleColumn": {
			const columns = state.columns.map(v => {
				if (v.id !== action.payload) {
					return v
				}
				return { ...v, selected: !v.selected }
			})
			return { ...state, columns }
		}
		case "toggleFilter": {
			const { id } = action.payload
			const filters = { ...state.filters }
			const f = filters[id]
			if (f) {
				delete filters[id]
			} else {
				const column = state.columns.find(c => id === c.id)
				if (column) {
					filters[id] = { column, value: "", options: [], oneOf: column.oneOf, not: false }
				}
			}
			return { ...state, filters }
		}
		case "setFilterInput": {
			const { id, value } = action.payload
			const filters = { ...state.filters }
			const f = filters[id]
			f.value = value
			filters[id] = { ...f }
			state.pageIndex = 0
			return { ...state, filters }
		}
		case "toggleFilterOption": {
			const { id, option } = action.payload
			const filters = { ...state.filters }
			const f = filters[id]
			const s = new Set(f.options)
			if (s.has(option)) {
				s.delete(option)
			} else {
				s.add(option)
			}
			f.options = Array.from(s)
			filters[id] = { ...f }
			state.pageIndex = 0
			return { ...state, filters }
		}
		case "clearFilter": {
			const { id } = action.payload
			const filters = { ...state.filters }
			const f = filters[id]
			filters[id] = { ...f, value: "", options: [] }
			return { ...state, filters }
		}
		case "sort": {
			const c = state.columns.find(v => v.id === action.payload.id)
			if (c && c.sortType === action.payload.sortType) {
				return state
			}
			const columns = state.columns.map(v => {
				if (v.id !== action.payload.id) {
					return { ...v, sortType: "" as SortType }
				}
				return { ...v, sortType: action.payload.sortType }
			})
			return { ...state, pageIndex: 0, columns }
		}
		case "size": {
			const size = typeof action.payload === "function" ? action.payload(state.size) : action.payload
			if (state.size === size) {
				return state
			}
			return { ...state, pageIndex: 0, size }
		}
		case "pageIndex": {
			const pageIndex = typeof action.payload === "function" ? action.payload(state.pageIndex) : action.payload
			if (state.pageIndex === pageIndex) {
				return state
			}
			return { ...state, pageIndex }
		}
		case "globalSearch": {
			const value =
				typeof action.payload === "function" ? action.payload(state.globalSearch.value) : action.payload
			const globalSearch = { ...state.globalSearch, value }
			return { ...state, globalSearch }
		}
		default:
			return state
	}
}

export interface GlobalCheckboxContext {
	/** Global checked */
	checked: boolean
	/** Global onChecked */
	onChecked(checked: boolean): void
	/** Global intermediate */
	intermediate: boolean
}

export interface CheckboxItemContext {
	checked: boolean
	onChecked(checked: boolean): void
}

export interface CheckboxContext {
	global: GlobalCheckboxContext
	items: CheckboxItemContext[]
}

export const checkboxReducer = (state: CheckboxContext, action: CheckboxAction) => {
	switch (action.type) {
		case "global": {
			const { checkList, checked } = action
			const g = { ...state.global }

			if (checked != null) {
				g.intermediate = false
				const items = state.items.slice()
				let cnt = 0
				for (let i = 0; i < items.length; i++) {
					if (checkList[i]) {
						items[i] = { ...items[i], checked }
						if (checked) {
							cnt++
						}
					}
				}
				g.checked = checked
				if (cnt > 0 && cnt !== items.length) {
					g.intermediate = true
				}
				return { global: g, items }
			}

			return { ...state, global: g }
		}
		case "row": {
			const items = state.items.slice()
			const { index, checked } = action
			const item = { ...items[index] }
			item.checked = checked
			items[index] = item

			const g = { ...state.global, intermediate: false }
			const first = items[0]?.checked ?? false
			g.checked = checked

			for (const { checked } of items) {
				if (first !== checked) {
					g.intermediate = true
					g.checked = true
					break
				}
			}
			return { global: g, items }
		}
		default:
			return state
	}
}
