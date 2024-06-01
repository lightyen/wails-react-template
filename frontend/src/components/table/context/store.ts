/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { defaultSearchFunction } from "./defaultSearch"
import type {
	FilterState,
	SelectFilterState,
	TableColumnItem,
	TableOptions,
	TableStore,
	TextFilterState,
	WithIndex,
} from "./model"

export const defaultLimitOptions = [10, 20, 30, 40, 50]

type C = ReturnType<typeof createStore<any>>

export const TableContext = createContext(null as unknown as C)

export function createStore<T extends {}>({
	source,
	persistedId,
	columns: _columns = [],
	limitOptions = defaultLimitOptions,
	limit = 10,
}: TableOptions<T>) {
	return create<TableStore<T>>()(
		immer(set => {
			const columns = _columns.map(
				column =>
					({
						...column,
						selected: column.selected ?? true,
						canSelected: column.canSelected ?? true,
						sortType: column.sortType ?? "",
					}) satisfies TableColumnItem<T>,
			)

			const { filtered, checkList } = filter(source, {}, "")

			const sorted = sort(filtered, columns)
			const view = sorted.slice(0, limit)

			const pageIndex = 0

			const pages = Math.ceil(filtered.length / limit)
			const notPrev = source.length === 0 || pageIndex === 0
			const notNext = source.length === 0 || pageIndex === pages - 1

			const state = {
				columns,
				filters: {},
				pagination: {
					pageIndex,
					limit,
					limitOptions,
					pages,
					notPrev,
					notNext,
				},
			}

			unbox(state as TableStore, persistedId)

			return {
				...state,
				persistedId,
				items: source.map(() => ({ checked: false })),
				global: {
					checked: false,
					intermediate: false,
					value: "",
					checkList,
				},
				source,
				filtered,
				sorted,
				view,
				reset(source) {
					set(state => {
						state.source = source as any[]
						state.items = source.map(() => ({ checked: false }))
						update(state, false)
					})
				},
				globalCheckbox(checked) {
					set(state => {
						const items = state.items

						let cnt = 0
						for (let i = 0; i < items.length; i++) {
							if (state.global.checkList[i]) {
								items[i].checked = checked
								if (checked) {
									cnt++
								}
							}
						}

						state.global.checked = checked
						state.global.intermediate = cnt > 0 && cnt !== items.length
					})
				},
				checkbox(checked, index) {
					set(state => {
						state.items[index].checked = checked

						state.global.intermediate = false
						state.global.checked = checked

						const first = state.items[0].checked

						for (const { checked } of state.items) {
							if (first !== checked) {
								state.global.intermediate = true
								state.global.checked = true
								break
							}
						}
					})
				},
				selectColumn(columnIndex, selected) {
					set(state => {
						if (columnIndex < 0 || columnIndex >= state.columns.length) {
							persist(state)
							return
						}
						const column = state.columns[columnIndex]
						column.selected = typeof selected === "function" ? selected(column.selected) : selected
						persist(state)
					})
				},
				addFilter(id, label, f) {
					set(state => {
						if (f instanceof Array) {
							if (typeof label !== "string") {
								return
							}
							state.filters[id] = {
								id,
								label,
								type: "select",
								kind: "oneof",
								options: f,
								value: [],
							} satisfies SelectFilterState<T>
						} else {
							state.filters[id] = {
								id,
								label,
								type: "text",
								kind: "is",
								value: "",
								match: f,
							} satisfies TextFilterState<T>
						}
					})
				},
				removeFilter(id) {
					set(state => {
						if (state.filters[id]) {
							delete state.filters[id]
							update(state)
							return
						}
					})
				},
				setGlobalSearch(value) {
					set(state => {
						state.global.value = typeof value === "function" ? value(state.global.value) : value
						update(state)
					})
				},
				clearFilter(id) {
					set(state => {
						const f = state.filters[id]
						if (!f) {
							return
						}
						if (f.type === "text") {
							f.value = ""
						} else if (f.type === "select") {
							f.value = []
						}
						update(state)
					})
				},
				setFilterText(id, value) {
					set(state => {
						const f = state.filters[id]
						if (!f) {
							return
						}
						if (f.type !== "text") {
							return
						}
						f.value = value
						update(state)
					})
				},
				toggleFilterOption(id, option) {
					set(state => {
						const f = state.filters[id]
						if (!f) {
							return
						}
						if (f.type !== "select") {
							return
						}
						const s = new Set(f.value.map(o => o.label))
						if (s.has(option.label)) {
							f.value.splice(
								f.value.findIndex(o => o.label === option.label),
								1,
							)
						} else {
							f.value.push(option)
						}
						update(state)
					})
				},
				sortColumn(columnIndex, type) {
					set(state => {
						if (columnIndex < 0 || columnIndex >= state.columns.length) {
							persist(state)
							return
						}

						const column = state.columns[columnIndex]
						type = typeof type === "function" ? type(column.sortType) : type

						if (column.sortType === type) {
							persist(state)
							return
						}

						column.sortType = type

						for (let i = 0; i < state.columns.length; i++) {
							if (i !== columnIndex) {
								const column = state.columns[i]
								column.sortType = ""
							}
						}

						state.pagination.pageIndex = 0
						updateSort(state)
						persist(state)
					})
				},
				setPageIndex(payload) {
					set(state => {
						const pageIndex = typeof payload === "function" ? payload(state.pagination.pageIndex) : payload
						if (state.pagination.pageIndex === pageIndex) {
							return
						}
						state.pagination.pageIndex = pageIndex
						updatePagination(state)
					})
				},
				prev() {
					set(state => {
						state.pagination.pageIndex--
						updatePagination(state)
					})
				},
				next() {
					set(state => {
						state.pagination.pageIndex++
						updatePagination(state)
					})
				},
				first() {
					set(state => {
						state.pagination.pageIndex = 0
						updatePagination(state)
					})
				},
				last() {
					set(state => {
						state.pagination.pageIndex = Math.ceil(state.filtered.length / state.pagination.limit) - 1
						updatePagination(state)
					})
				},
				to(pageIndex) {
					set(state => {
						if (state.pagination.pageIndex === pageIndex || state.filtered.length === 0) {
							return
						}

						if (pageIndex === 0) {
							state.pagination.pageIndex = 0
						} else {
							const offsetPage = pageIndex - state.pagination.pageIndex
							state.pagination.pageIndex += offsetPage
						}

						updatePagination(state)
					})
				},
				setLimit(limit) {
					set(state => {
						if (state.pagination.limit === limit) {
							return
						}
						state.pagination.limit = limit
						updatePagination(state)
						persist(state)
					})
				},
			}
		}),
	)

	function persist(state: TableStore) {
		if (state.persistedId) {
			const data = {
				columns: state.columns.map(v => ({
					selected: v.selected,
					sortType: v.sortType,
				})),
				pagination: {
					limit: state.pagination.limit,
				},
			}
			localStorage.setItem(state.persistedId, JSON.stringify(data))
		}
	}

	function unbox(state: TableStore, persistedId?: string) {
		if (persistedId) {
			const configStr = localStorage.getItem(persistedId)
			if (configStr) {
				const v = JSON.parse(configStr)
				if (typeof v === "object") {
					if (v.pagination) {
						Object.assign(state.pagination, v.pagination)
					}
					if (v.columns instanceof Array) {
						for (let i = 0; i < state.columns.length && i < v.columns.length; i++) {
							Object.assign(state.columns[i], v.columns[i])
						}
					}
				}
			}
		}
	}

	function update(state: TableStore, resetPage = true) {
		const { filtered, checkList } = filter(state.source, state.filters, state.global.value)
		state.filtered = filtered
		state.global.checkList = checkList
		updateSort(state, resetPage)
	}

	function updateSort(state: TableStore, resetPage = true) {
		if (resetPage) {
			state.pagination.pageIndex = 0
		}
		state.sorted = sort(state.filtered, state.columns)
		updatePagination(state)
	}

	function updatePagination(state: TableStore) {
		const offset = state.pagination.pageIndex * state.pagination.limit
		state.view = state.sorted.slice(offset, offset + state.pagination.limit)
		state.pagination.pages = Math.ceil(state.filtered.length / state.pagination.limit)
		state.pagination.notPrev = state.filtered.length === 0 || state.pagination.pageIndex === 0
		state.pagination.notNext =
			state.filtered.length === 0 || state.pagination.pageIndex === state.pagination.pages - 1
	}

	function filter(source: T[], filters: Record<string, FilterState<T>>, globalSearch: string) {
		const oneOf: FilterState<T>[] = []

		let fs = Object.values(filters).filter(f => {
			if (f.type === "text") {
				return f.value != ""
			}
			if (f.type === "select") {
				return f.value.length > 0
			}
			return false
		})

		fs = fs.filter(f => {
			if (f.kind === "oneof") {
				oneOf.push(f)
				return false
			}
			return true
		})

		const checkList: boolean[] = new Array(source.length).fill(true)

		let filtered: WithIndex<T>[] = source.map<WithIndex<T>>((data, i) => ({ ...data, dataIndex: i }))

		if (globalSearch) {
			const match = defaultSearchFunction(globalSearch)
			filtered = filtered.filter(record => {
				for (const value of Object.values(record)) {
					if (match(String(value))) {
						return true
					}
				}
				checkList[record.dataIndex] = false
				return false
			})
		}

		if (fs.length > 0) {
			for (const f of fs) {
				if (f.type === "text") {
					const value = f.value.trim()
					const ans = f.kind !== "not"
					const defaultSearch = defaultSearchFunction(value)

					filtered = filtered.filter(record => {
						if (f.match(record, value, defaultSearch) === ans) {
							return true
						}
						checkList[record.dataIndex] = false
						return false
					})
				} else if (f.type === "select") {
					for (const opt of f.value) {
						filtered = filtered.filter(record => {
							if (opt.filter(record)) {
								return true
							}
							checkList[record.dataIndex] = false
							return false
						})
					}
				}
			}
		}

		if (oneOf.length > 0) {
			filtered = filtered.filter(record => {
				for (const filter of oneOf) {
					if (filter.type === "text") {
						const value = filter.value.trim()
						const ans = filter.kind !== "not"
						const defaultSearch = defaultSearchFunction(value)
						if (filter.match(record, value, defaultSearch) === ans) {
							return true
						}
					} else if (filter.type === "select") {
						for (const opt of filter.value) {
							if (opt.filter(record)) {
								return true
							}
						}
					}
				}

				checkList[record.dataIndex] = false
				return false
			})
		}

		return { checkList, filtered }
	}

	function sort(source: WithIndex<T>[], columns: TableColumnItem<T>[]) {
		const s = source.slice()
		for (const column of columns) {
			if (!column.sortType) {
				continue
			}
			if (column.compare != null) {
				const comp = column.compare
				if (column.sortType === "asc") {
					s.sort(comp)
				} else {
					s.sort((a, b) => comp(b, a))
				}
				return s
			}
		}
		return source
	}
}
