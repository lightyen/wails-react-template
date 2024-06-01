/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, ReactElement } from "react"

export type SortType = "" | "asc" | "desc"

export interface FilterInput<T> {
	(record: T, value: string, defaultSearch: (record: string, value: string) => boolean): boolean
}

export interface FilterSelectOptions<T> {
	label: string
	filter(record: T): boolean
}

interface GlobalLabelProps {
	checked: boolean
	onChecked(checked: boolean): void
	intermediate: boolean
}

interface LabelProps {
	checked: boolean
	onChecked(checked: boolean): void
}

export type Label = string | ReactElement | ComponentType<GlobalLabelProps>

export interface TableBaseColumn<T> {
	id: string
	label: Label
	Component?: ComponentType<{ record: T } & LabelProps>
	className?: string
	style?: unknown
	compare?(a: T, b: T): number
	filter?: FilterInput<T> | Array<FilterSelectOptions<T>>
}

export interface TableColumnItem<T = unknown> extends TableBaseColumn<T> {
	selected: boolean
	canSelected: boolean
	sortType: SortType
}

// ==, ||, !=
export type FilterMatchKind = "is" | "oneof" | "not"

export interface TextFilterState<T> {
	id: string
	label: Label
	kind: FilterMatchKind
	type: "text"
	value: string
	match(record: T, value: string, defaultSearch: (record: string, value: string) => boolean): boolean
}

export interface SelectFilterState<T> {
	id: string
	label: string
	kind: FilterMatchKind
	type: "select"
	value: FilterSelectOptions<T>[]
	options: FilterSelectOptions<T>[]
}

export type FilterState<T> = TextFilterState<T> | SelectFilterState<T>

interface Global {
	checked: boolean
	intermediate: boolean
	value: string
	checkList: boolean[]
}

interface CheckboxItem {
	checked: boolean
}

interface Pagination {
	/** base index 0 */
	pageIndex: number
	/** @default 10 */
	limit: number
	limitOptions: number[]
	pages: number
	notPrev: boolean
	notNext: boolean
}

interface UseTableColumnItem<T> extends TableBaseColumn<T> {
	/** @default true */
	selected?: boolean
	/** @default true */
	canSelected?: boolean
	/** @default "" */
	sortType?: SortType
}

export interface TableDataOptions<T> {
	columns: UseTableColumnItem<T>[]
	/** default limit value
	 *  @default 10
	 */
	limit?: number

	/** @default '[10, 20, 30, 40, 50]' */
	limitOptions?: number[]
}

export interface TableOptions<T> extends TableDataOptions<T> {
	source: T[]
	persistedId?: string
}

export type WithIndex<T> = T & { dataIndex: number }

export interface TableStore<T = any> {
	persistedId?: string
	columns: TableColumnItem<T>[]
	filters: Record<string, FilterState<T>>
	items: CheckboxItem[]
	global: Global
	pagination: Pagination
	source: T[]
	filtered: WithIndex<T>[]
	sorted: WithIndex<T>[]
	view: WithIndex<T>[]

	reset(source: T[]): void
	globalCheckbox(checked: boolean): void
	checkbox(checked: boolean, index: number): void
	setGlobalSearch(value: string | ((prev: string) => string)): void
	selectColumn(columnIndex: number, selected: boolean | ((prev: boolean) => boolean)): void
	addFilter(filterId: string, label: Label, f: FilterInput<T> | FilterSelectOptions<T>[]): void
	removeFilter(filterId: string): void
	clearFilter(filterId: string): void
	setFilterText(filterId: string, value: string): void
	toggleFilterOption(filterId: string, option: FilterSelectOptions<T>): void
	sortColumn(columnIndex: number, type: SortType | ((prev: SortType) => SortType)): void
	setPageIndex(pageIndex: number | ((prev: number) => number)): void
	prev(): void
	next(): void
	first(): void
	last(): void
	to(pageIndex: number): void
	setLimit(limit: number): void
}
