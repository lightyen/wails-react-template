import {
	CaretSortIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { useMemo } from "react"
import { useTableStore } from "."
import { Button } from "../button"
import { Command, CommandItem, CommandList } from "../command"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../popover"

interface PaginationItem {
	type: "first" | "last" | "prev" | "next"
	onClick?: React.MouseEventHandler
	disabled: boolean
}

function SwitchLimit() {
	const useSelect = useTableStore()
	const limit = useSelect(state => state.pagination.limit)
	const limitOptions = useSelect(state => state.pagination.limitOptions)
	const setLimit = useSelect(state => state.setLimit)
	return (
		<div tw="ml-auto flex items-center gap-x-2">
			<span tw="hidden lg:inline">Rows per page</span>
			<Popover placement="bottom-end">
				<PopoverTrigger>
					<Button variant="outline" tw="order-1 px-3 w-[70px] h-8 flex gap-2 justify-between items-center">
						<span tw="pointer-events-none">{limit}</span>
						<CaretSortIcon tw="h-4 w-4 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<Command tw="w-[70px] p-1">
						<PopoverClose>
							<CommandList>
								<CommandItem value="-" tw="hidden" />
								{limitOptions.map((value, i) => (
									<CommandItem
										key={i}
										onSelect={() => setLimit(value)}
										data-state={limit === value ? "selected" : ""}
										tw="flex justify-between [& svg]:invisible [&[data-state=selected] svg]:visible"
									>
										<span tw="pointer-events-none">{value}</span>
										<CheckIcon />
									</CommandItem>
								))}
							</CommandList>
						</PopoverClose>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}

export function TablePagination() {
	const useSelect = useTableStore()
	const total = useSelect(state => state.filtered.length)
	const { pageIndex, limit, notNext, notPrev } = useSelect(state => state.pagination)
	const first = useSelect(state => state.first)
	const last = useSelect(state => state.last)
	const prev = useSelect(state => state.prev)
	const next = useSelect(state => state.next)

	const items = useMemo<PaginationItem[]>(() => {
		const items: PaginationItem[] = []
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
	}, [notNext, notPrev, prev, next, first, last])

	return (
		<div
			aria-label="table-pagination"
			tw="flex items-center sm:justify-between md:px-2 gap-x-2 md:gap-x-6 lg:gap-x-8"
		>
			<div tw="text-sm">
				<span tw="hidden sm:inline">Count: </span>
				{total}
			</div>
			<SwitchLimit />
			<div tw="flex w-[100px] items-center justify-center text-sm font-medium">
				Page {pageIndex + 1} of {Math.ceil(total / limit)}
			</div>
			<div tw="flex items-center gap-x-2 select-none">
				{items.map((item, i) => {
					switch (item.type) {
						case "first":
							return (
								<Button
									key={i}
									onClick={first}
									variant="outline"
									tw="hidden h-8 w-8 p-0 lg:flex"
									disabled={item.disabled}
								>
									<DoubleArrowLeftIcon tw="h-4 w-4" />
								</Button>
							)

						case "prev":
							return (
								<Button
									key={i}
									onClick={prev}
									aria-label="previous page"
									variant="outline"
									tw="h-8 w-8 p-0"
									disabled={item.disabled}
								>
									<ChevronLeftIcon tw="h-4 w-4" />
								</Button>
							)

						case "next":
							return (
								<Button
									key={i}
									onClick={next}
									aria-label="next page"
									variant="outline"
									tw="h-8 w-8 p-0"
									disabled={item.disabled}
								>
									<ChevronRightIcon tw="h-4 w-4" />
								</Button>
							)

						case "last":
							return (
								<Button
									key={i}
									onClick={last}
									variant="outline"
									tw="hidden h-8 w-8 p-0 lg:flex"
									disabled={item.disabled}
								>
									<DoubleArrowRightIcon tw="h-4 w-4" />
								</Button>
							)
						default:
							return null
					}
				})}
			</div>
		</div>
	)
}
