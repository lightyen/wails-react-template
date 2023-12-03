import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from "@radix-ui/react-icons"
import { forwardRef, memo, type ForwardedRef, type PropsWithChildren, type TableHTMLAttributes } from "react"
import { Button } from "../button"
import { Command, CommandItem, CommandList } from "../command"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../popover"
import type { TableViewFeature } from "./feature"
import type { Label, SortType } from "./model"
import type { GlobalCheckboxContext } from "./reducer"

function SortButton({
	sortType,
	onSort,
	children,
}: PropsWithChildren<{ sortType?: SortType; onSort?(t: SortType): void }>) {
	return (
		<Popover>
			<PopoverTrigger>
				<Button variant="ghost" size="sm" tw="relative -ml-3 h-8">
					{children}
					{sortType === "desc" ? (
						<ArrowDownIcon tw="ml-2 h-4 w-4" />
					) : sortType === "asc" ? (
						<ArrowUpIcon tw="ml-2 h-4 w-4" />
					) : (
						<CaretSortIcon tw="ml-2 h-4 w-4" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command tw="w-32 p-1">
					<PopoverClose>
						<CommandList>
							<CommandItem onSelect={() => onSort?.("")} tw="flex gap-2">
								<CaretSortIcon />
								<span tw="pointer-events-none capitalize">Default</span>
							</CommandItem>
							<CommandItem onSelect={() => onSort?.("asc")} tw="flex gap-2">
								<ArrowUpIcon />
								<span tw="pointer-events-none capitalize">Asc</span>
							</CommandItem>
							<CommandItem onSelect={() => onSort?.("desc")} tw="flex gap-2">
								<ArrowDownIcon />
								<span tw="pointer-events-none capitalize">Desc</span>
							</CommandItem>
						</CommandList>
					</PopoverClose>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

const TableWrapper = memo(
	forwardRef(function TableWrapper(
		{ children, ...props }: TableHTMLAttributes<HTMLTableElement>,
		ref: ForwardedRef<HTMLTableElement>,
	) {
		return (
			<div aria-label="table-view" tw="rounded-md border overflow-x-auto">
				<div tw="relative w-full">
					<table ref={ref} tw="w-full caption-bottom text-sm whitespace-nowrap" {...props}>
						{children}
					</table>
				</div>
			</div>
		)
	}),
)

function thLabel(Label: Label, context?: GlobalCheckboxContext) {
	if (typeof Label === "string") {
		return Label
	}
	if (typeof Label === "function") {
		if (context) {
			return <Label {...context} />
		}
		return null
	}
	return Label
}

export function TableView<TData extends {}>({
	result,
	columns,
	limit,
	checkbox,
	pageIndex,
	children,
	...props
}: PropsWithChildren<TableViewFeature<TData> & TableHTMLAttributes<HTMLTableElement>>) {
	columns = columns.filter(c => c.selected)
	const hasHeader = columns.some(c => c.label)

	return (
		<TableWrapper {...props}>
			{hasHeader && (
				<thead tw="[& tr]:border-b">
					<tr tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted">
						{columns.map(({ label, compare, sortType, sort, className, style: _style }, i) => {
							return (
								<th
									tw="h-10 px-2 first-of-type:pl-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-2"
									css={_style}
									className={className}
									key={i}
								>
									{compare ? (
										<SortButton sortType={sortType} onSort={sort}>
											{thLabel(label)}
										</SortButton>
									) : (
										thLabel(label, checkbox.global)
									)}
								</th>
							)
						})}
					</tr>
				</thead>
			)}
			<tbody tw="[& tr:last-of-type]:border-0">
				{result.map((row, rowIndex) => {
					const context = checkbox.items[row._Index]
					return row ? (
						<tr
							tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted"
							key={rowIndex}
							data-state={context.checked ? "selected" : undefined}
						>
							{columns.map(({ Component, id }, colIndex) => {
								return (
									<td
										tw="p-2 first-of-type:pl-4 align-middle [&:has([role=checkbox])]:pr-2"
										key={colIndex}
									>
										{Component ? <Component row={row} {...context} /> : id && row[id]}
									</td>
								)
							})}
						</tr>
					) : (
						<tr
							tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted"
							key={rowIndex}
						>
							<td
								tw="p-2 first-of-type:pl-4 align-middle [&:has([role=checkbox])]:pr-2"
								colSpan={columns.length}
							>
								&nbsp;
							</td>
						</tr>
					)
				})}
				{limit &&
					Array.from(Array((limit - (result.length % limit)) % limit)).map((_, i) => (
						<tr
							tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted"
							key={i}
						>
							<td
								tw="p-2 first-of-type:pl-4 align-middle [&:has([role=checkbox])]:pr-2"
								colSpan={columns.length}
							>
								&nbsp;
							</td>
						</tr>
					))}
			</tbody>
		</TableWrapper>
	)
}
