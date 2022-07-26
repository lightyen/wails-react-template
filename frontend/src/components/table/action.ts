import { FilterSelectOptions, type SortType } from "./model"

interface ToggleColumnAction {
	type: "toggleColumn"
	payload: string
}

interface SetColumnSortAction {
	type: "sort"
	payload: {
		id: string
		sortType: SortType
	}
}

interface ToogleFilterAction {
	type: "toggleFilter"
	payload: {
		id: string
	}
}

interface SetFilterInputAction {
	type: "setFilterInput"
	payload: {
		id: string
		value: string
	}
}

interface ToogleFilterOptionAction<T extends {}> {
	type: "toggleFilterOption"
	payload: {
		id: string
		option: FilterSelectOptions<T>
	}
}

interface ClearFilterAction {
	type: "clearFilter"
	payload: {
		id: string
	}
}

interface SetPageIndexAction {
	type: "pageIndex"
	payload: number | ((prev: number) => number)
}

interface SetSizeAction {
	type: "size"
	payload: number | ((prev: number) => number)
}

interface SetGlobalSearchAction {
	type: "globalSearch"
	payload: string | ((prev: string) => string)
}

export type TableAction<T extends {}> =
	| ToggleColumnAction
	| SetColumnSortAction
	| ToogleFilterAction
	| SetFilterInputAction
	| ToogleFilterOptionAction<T>
	| ClearFilterAction
	| SetPageIndexAction
	| SetSizeAction
	| SetGlobalSearchAction

interface CheckboxGlobalAction {
	type: "global"
	checkList: boolean[]
	checked: boolean
}

interface CheckboxRowAction {
	type: "row"
	index: number
	checked: boolean
}

export type CheckboxAction = CheckboxGlobalAction | CheckboxRowAction
