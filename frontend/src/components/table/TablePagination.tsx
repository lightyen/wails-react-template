import {
	CaretSortIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Button } from "../button"
import { Command, CommandItem, CommandList } from "../command"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../popover"
import { PaginationFeature } from "./feature"
import { style } from "./style"

function SwitchLimit({ limitOptions, limit, setLimit }: PaginationFeature) {
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
										css={style.pagination.limitItem}
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

export function TablePagination(props: PaginationFeature) {
	const { current, total, items, limit, first, last, prev, next } = props
	return (
		<div
			aria-label="table-pagination"
			tw="flex items-center sm:justify-between md:px-2 gap-x-2 md:gap-x-6 lg:gap-x-8"
		>
			<div tw="text-sm">
				<span tw="hidden sm:inline">Count: </span>
				{props.total}
			</div>
			<SwitchLimit {...props} />
			<div tw="flex w-[100px] items-center justify-center text-sm font-medium">
				Page {current + 1} of {Math.ceil(total / limit)}
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
									css={style.pagination.last}
									disabled={item.disabled}
								>
									<DoubleArrowLeftIcon css={style.pagination.icon} />
								</Button>
							)

						case "prev":
							return (
								<Button
									key={i}
									onClick={prev}
									variant="outline"
									css={style.pagination.next}
									disabled={item.disabled}
								>
									<ChevronLeftIcon css={style.pagination.icon} />
								</Button>
							)

						case "next":
							return (
								<Button
									key={i}
									onClick={next}
									variant="outline"
									css={style.pagination.next}
									disabled={item.disabled}
								>
									<ChevronRightIcon css={style.pagination.icon} />
								</Button>
							)

						case "last":
							return (
								<Button
									key={i}
									onClick={last}
									variant="outline"
									css={style.pagination.last}
									disabled={item.disabled}
								>
									<DoubleArrowRightIcon css={style.pagination.icon} />
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
