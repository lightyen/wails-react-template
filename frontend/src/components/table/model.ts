import { type ComponentType } from "@react-spring/web"
import { type ReactElement } from "react"
import { CheckboxItemContext, GlobalCheckboxContext } from "./reducer"

export type SortType = "" | "asc" | "desc"

export type WithIndex<T> = T & { _Index: number }

export interface FilterInput<TData extends {} = {}> {
	(record: TData, value: string, defaultSearch: (record: string, value: string) => boolean): boolean
}

export interface FilterSelectOptions<TData extends {} = {}> {
	label: string
	filter(record: TData): boolean
}

export type Label = string | ReactElement | ComponentType<GlobalCheckboxContext>

export interface TableBaseColumn<T extends {} = {}> {
	id: string
	label: Label
	Component?: ComponentType<{ row: T } & CheckboxItemContext>
	className?: string
	style?: unknown
	compare?(a: T, b: T): number
	filter?: FilterInput<T> | FilterSelectOptions<T>[]
}

export interface TableColumnItem<T extends {} = {}> extends TableBaseColumn<T> {
	oneOf: boolean
	toggleColumn(): void
	selected: boolean
	canSelected: boolean
	sort(type: SortType): void
	sortType: SortType
	toggleFilter(): void
	setFilterInput(value: string): void
	clearFilter(): void
	toggleFilterOption(v: FilterSelectOptions<T>): void
}

export interface FilterState<T extends {} = {}> {
	column: TableColumnItem<T>
	oneOf: boolean
	not: boolean
	value: string
	options: FilterSelectOptions<T>[]
}
