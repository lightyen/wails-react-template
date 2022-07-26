import { useCallback, useMemo, useReducer, useRef, type Reducer } from "react"
import type { CheckboxAction, TableAction } from "./action"
import { defaultSearchFunction } from "./defaultSearch"
import type { PaginationItem } from "./feature"
import type { FilterState, SortType, TableBaseColumn, TableColumnItem, WithIndex } from "./model"
import { checkboxReducer, reducer, type CheckboxContext, type TableContext } from "./reducer"

const defaultSizeOptions = [10, 20, 30, 40, 50]

export interface UseTableColumnItem<TData extends {} = {}> extends TableBaseColumn<TData> {
	/** @default true */
	defaultSelected?: boolean
	/** @default true */
	canSelected?: boolean
	/** @default "" */
	defaultSortType?: SortType
	defaultLimit?: number
}

interface UseTableDataOptions<T extends {}> {
	columns: UseTableColumnItem<T>[]
	/** @default 10 */
	defaultLimit?: number
	/** @default [10, 20, 30, 40, 50] */
	limitOptions?: number[]
}

function useTableColumn<TData extends {}>({
	columns,
	defaultLimit,
}: {
	columns: UseTableColumnItem<TData>[]
	defaultLimit: number
}) {
	const [context, dispatch] = useReducer<
		Reducer<TableContext<TData>, TableAction<TData>>,
		UseTableColumnItem<TData>[]
	>(reducer, columns, (initial): TableContext<TData> => {
		const columns = initial.map<TableColumnItem<TData>>(column => ({
			...column,
			selected: column.defaultSelected ?? true,
			canSelected: column.canSelected ?? true,
			sortType: column.defaultSortType ?? "",
			oneOf: column.filter && column.filter instanceof Array ? true : false,
			toggleColumn() {
				dispatch({ type: "toggleColumn", payload: column.id })
			},
			toggleFilter() {
				if (column.filter) {
					dispatch({ type: "toggleFilter", payload: { id: column.id } })
				}
			},
			setFilterInput(value) {
				if (column.filter) {
					dispatch({ type: "setFilterInput", payload: { id: column.id, value } })
				}
			},
			clearFilter() {
				if (column.filter) {
					dispatch({ type: "clearFilter", payload: { id: column.id } })
				}
			},
			toggleFilterOption(option) {
				if (column.filter) {
					dispatch({ type: "toggleFilterOption", payload: { id: column.id, option } })
				}
			},
			sort(sortType: SortType) {
				dispatch({ type: "sort", payload: { id: column.id, sortType } })
			},
		}))
		return {
			columns,
			filters: {},
			pageIndex: 0,
			size: defaultLimit,
			setSize(v) {
				dispatch({ type: "size", payload: v })
			},
			setPageIndex(i) {
				dispatch({ type: "pageIndex", payload: i })
			},
			globalSearch: {
				value: "",
				setValue(value) {
					dispatch({ type: "globalSearch", payload: value })
				},
				clearValue() {
					dispatch({ type: "globalSearch", payload: "" })
				},
			},
		}
	})
	return { context }
}

function useDataFilters<TData extends {}>(source: TData[], context: TableContext<TData>) {
	const checkList = useRef<boolean[]>([])
	const { filteredSource } = useMemo(() => {
		const oneOf: FilterState<TData>[] = []

		let filters = Object.values(context.filters).filter(f => {
			if (f.column.filter == null) {
				return false
			}
			if (typeof f.column.filter === "function") {
				return f.value != ""
			}
			return f.options.length > 0
		})

		filters = filters.filter(f => {
			if (f.oneOf) {
				oneOf.push(f)
				return false
			}
			return true
		})

		checkList.current = new Array(source.length).fill(true)
		let filteredSource = source.map<WithIndex<TData>>((src, i) => ({ ...src, _Index: i }))

		if (context.globalSearch && context.globalSearch.value) {
			const match = defaultSearchFunction(context.globalSearch.value)
			filteredSource = filteredSource.filter((record, rowIndex) => {
				for (const value of Object.values(record)) {
					if (match(String(value))) {
						return true
					}
				}
				checkList.current[rowIndex] = false
				return false
			})
		}

		if (filters.length > 0) {
			for (const { not, column, value: v, options } of filters) {
				const value = v.trim()
				const { filter } = column
				const ans = !not
				const defaultSearch = defaultSearchFunction(value)
				if (typeof filter === "function") {
					filteredSource = filteredSource.filter((record, rowIndex) => {
						if (filter(record, value, defaultSearch) === ans) {
							return true
						}
						checkList.current[rowIndex] = false
						return false
					})
				} else if (filter instanceof Array) {
					for (const opt of options) {
						filteredSource = filteredSource.filter((record, rowIndex) => {
							if (opt.filter(record) === ans) {
								return true
							}
							checkList.current[rowIndex] = false
							return false
						})
					}
				}
			}
		}

		if (oneOf.length > 0) {
			filteredSource = filteredSource.filter((record, rowIndex) => {
				for (const { not, column, value, options } of oneOf) {
					const { filter } = column
					const ans = !not
					const defaultSearch = defaultSearchFunction(value)
					if (typeof filter === "function") {
						if (filter(record, value, defaultSearch) === ans) {
							return true
						}
					} else if (filter instanceof Array) {
						for (const opt of options) {
							if (opt.filter(record) === ans) {
								return true
							}
						}
					}
				}
				checkList.current[rowIndex] = false
				return false
			})
		}
		return { filteredSource }
	}, [source, context.globalSearch, context.filters])

	const [checkbox, dispatch] = useReducer<Reducer<CheckboxContext, CheckboxAction>, TData[]>(
		checkboxReducer,
		source,
		(initial): CheckboxContext => {
			const items = initial.map((_, index) => {
				return {
					checked: false,
					onChecked: (checked: boolean) => {
						dispatch({ type: "row", index, checked })
					},
				}
			})
			return {
				global: {
					intermediate: false,
					checked: false,
					onChecked(checked) {
						dispatch({ type: "global", checkList: checkList.current, checked })
					},
				},
				items,
			}
		},
	)

	return { filteredSource, checkbox }
}

export function useTableData<TData extends {}>(
	source: TData[] = [],
	{ columns = [], limitOptions = defaultSizeOptions, defaultLimit = 10 }: UseTableDataOptions<TData> = {
		columns: [],
		limitOptions: defaultSizeOptions,
	},
) {
	const { context } = useTableColumn({ columns, defaultLimit })

	const { checkbox, filteredSource } = useDataFilters(source, context)

	const result = useMemo(() => {
		const clone = filteredSource.slice()
		for (const col of context.columns) {
			if (!col.sortType) {
				continue
			}
			if (col.compare != null) {
				const comp = col.compare
				if (col.sortType === "asc") {
					clone.sort(comp)
				} else {
					clone.sort((a, b) => comp(b, a))
				}
				const offset = context.pageIndex * context.size
				return clone.slice(offset, offset + context.size)
			}
		}
		const offset = context.pageIndex * context.size
		return filteredSource.slice(offset, offset + context.size)
	}, [filteredSource, context.columns, context.pageIndex, context.size])

	const first = useCallback(() => {
		context.setPageIndex(0)
	}, [context])

	const prev = useCallback(() => {
		context.setPageIndex(p => p - 1)
	}, [context])

	const next = useCallback(() => {
		context.setPageIndex(p => p + 1)
	}, [context])

	const last = useCallback(() => {
		context.setPageIndex(() => Math.ceil(filteredSource.length / context.size) - 1)
	}, [filteredSource, context])

	/** @param to base index 0 */
	const to = useCallback(
		(to: number) => {
			if (filteredSource.length === 0) return
			if (to === 0) {
				first()
				return
			}

			if (to === Math.ceil(filteredSource.length / context.size) - 1) {
				last()
				return
			}
			const offsetPage = to - context.pageIndex
			if (offsetPage !== 0) {
				context.setPageIndex(p => p + offsetPage)
			}
		},
		[filteredSource, first, last, context],
	)

	const items = useMemo<PaginationItem[]>(() => {
		const items: PaginationItem[] = []
		const pages = Math.ceil(filteredSource.length / context.size)
		const notPrev = filteredSource.length === 0 || context.pageIndex === 0
		const notNext = filteredSource.length === 0 || context.pageIndex === pages - 1
		items.push({
			type: "first",
			disabled: notPrev,
			onClick: first,
		})
		items.push({
			type: "prev",
			disabled: notPrev,
			onClick: prev,
		})
		items.push({
			type: "next",
			disabled: notNext,
			onClick: next,
		})
		items.push({
			type: "last",
			disabled: notNext,
			onClick: last,
		})
		return items
	}, [filteredSource, prev, next, first, last, context])

	const { start, end, current } = useMemo(() => {
		const start = filteredSource.length ? context.pageIndex * context.size + 1 : 0
		const end = Math.min(filteredSource.length, (context.pageIndex + 1) * context.size)
		return {
			current: context.pageIndex,
			start,
			end,
		}
	}, [filteredSource, context])

	return {
		viewContext: {
			result,
			pageIndex: context.pageIndex,
			limit: context.size,
			columns: context.columns,
			checkbox,
		},
		toolbarContext: context,
		paginationContext: {
			total: filteredSource.length,
			items,
			start,
			end,
			current,
			prev,
			next,
			to,
			first,
			last,
			limitOptions,
			limit: context.size,
			setLimit: context.setSize,
		},
	}
}
