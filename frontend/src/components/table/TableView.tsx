import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from "@radix-ui/react-icons"
import { ForwardedRef, forwardRef, memo, type PropsWithChildren, type TableHTMLAttributes } from "react"
import { Button } from "../button"
import { Command, CommandItem, CommandList } from "../command"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../popover"
import type { TableViewFeature } from "./feature"
import type { Label, SortType } from "./model"
import type { GlobalCheckboxContext } from "./reducer"
import { style } from "./style"

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
						<ArrowDownIcon css={style.sortIcon} />
					) : sortType === "asc" ? (
						<ArrowUpIcon css={style.sortIcon} />
					) : (
						<CaretSortIcon css={style.sortIcon} />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command tw="w-32 p-1">
					<PopoverClose>
						<CommandList>
							<CommandItem onSelect={() => onSort?.("")} css={style.pagination.sortItem}>
								<CaretSortIcon />
								<span tw="pointer-events-none capitalize">Default</span>
							</CommandItem>
							<CommandItem onSelect={() => onSort?.("asc")} css={style.pagination.sortItem}>
								<ArrowUpIcon />
								<span tw="pointer-events-none capitalize">Asc</span>
							</CommandItem>
							<CommandItem onSelect={() => onSort?.("desc")} css={style.pagination.sortItem}>
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
			<div aria-label="table-view" css={style.tableBorder}>
				<div css={style.tableWrapper}>
					<table ref={ref} css={style.table} {...props}>
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
				<thead css={style.thead}>
					<tr css={style.tr}>
						{columns.map(({ label, compare, sortType, sort, className, style: _style }, i) => {
							return (
								<th css={[style.th, _style]} className={className} key={i}>
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
			<tbody css={style.tbody}>
				{result.map((row, rowIndex) => {
					const context = checkbox.items[row._Index]
					return row ? (
						<tr css={style.tr} key={rowIndex} data-state={context.checked ? "selected" : undefined}>
							{columns.map(({ Component, id }, colIndex) => {
								return (
									<td css={style.td} key={colIndex}>
										{Component ? <Component row={row} {...context} /> : id && row[id]}
									</td>
								)
							})}
						</tr>
					) : (
						<tr css={style.tr} key={rowIndex}>
							<td css={style.td} colSpan={columns.length}>
								&nbsp;
							</td>
						</tr>
					)
				})}
				{limit &&
					Array.from(Array((limit - (result.length % limit)) % limit)).map((_, i) => (
						<tr css={style.tr} key={i}>
							<td css={style.td} colSpan={columns.length}>
								&nbsp;
							</td>
						</tr>
					))}
			</tbody>
		</TableWrapper>
	)
}
