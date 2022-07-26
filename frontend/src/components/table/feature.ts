import type { MouseEventHandler } from "react"
import type { TableColumnItem, WithIndex } from "./model"
import type { CheckboxContext } from "./reducer"

export interface PaginationItem {
	type: "first" | "last" | "prev" | "next"
	onClick?: MouseEventHandler
	disabled: boolean
}

export interface PaginationFeature {
	items: PaginationItem[]
	total: number
	start: number
	end: number
	current: number
	first(): void
	last(): void
	prev(): void
	next(): void
	to(v: number): void
	limit: number
	setLimit(v: number): void
	limitOptions: number[]
}

export interface TableViewFeature<T extends {}> {
	checkbox: CheckboxContext
	columns: TableColumnItem<T>[]
	pageIndex: number
	limit: number
	result: WithIndex<T>[]
}
