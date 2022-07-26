import { CheckIcon, Cross2Icon, MixerHorizontalIcon, PlusCircledIcon, ResetIcon } from "@radix-ui/react-icons"
import { type PropsWithChildren, type SVGProps } from "react"
import { Badge } from "../badage"
import { Button } from "../button"
import { Checkbox } from "../checkbox"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../command"
import { Input } from "../input"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../popover"
import type { FilterState, Label, TableColumnItem } from "./model"
import { GlobalCheckboxContext, type TableContext } from "./reducer"
import { style } from "./style"

function commandLabel(Label: Label, context?: GlobalCheckboxContext) {
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

function MdiFilterPlusOutlineIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="M15 17h3v-3h2v3h3v2h-3v3h-2v-3h-3v-2m-2 2.88c.04.3-.06.62-.28.83c-.4.39-1.03.39-1.42 0L7.29 16.7a.989.989 0 0 1-.29-.83v-5.12L2.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L13 10.75v9.13M5.04 5L9 10.07v5.51l2 2v-7.53L14.96 5H5.04Z"
			></path>
		</svg>
	)
}

function TableToolbarAddFilters<T extends {}>({
	columns,
	filters,
}: {
	columns: TableColumnItem<T>[]
	filters: Record<string, FilterState<T>>
}) {
	return (
		<PopoverClose>
			<CommandList>
				<CommandItem value="-" tw="hidden" />
				{columns.map(({ id, label, filter, toggleFilter }) =>
					filter && id !== "checkbox" ? (
						<CommandItem
							key={id}
							css={style.toolbar.columnView}
							onSelect={toggleFilter}
							data-state={filters[id] ? "selected" : ""}
						>
							<CheckIcon />
							<span tw="pointer-events-none capitalize">{commandLabel(label)}</span>
						</CommandItem>
					) : null,
				)}
			</CommandList>
		</PopoverClose>
	)
}

function FilterButton<T extends {}>({ children, column, value, options }: PropsWithChildren<FilterState<T>>) {
	if (!column.filter) {
		return null
	}

	if (typeof column.filter === "function") {
		return (
			<div tw="relative flex flex-nowrap">
				<Popover placement="bottom-start">
					<PopoverTrigger>
						<Button
							variant="outline"
							size="sm"
							tw="border-dashed z-10 h-8 rounded-r-none flex gap-2 items-center hover:(border-solid bg-background text-foreground)"
						>
							{children}
							{value && (
								<Badge variant="secondary" tw="whitespace-pre">
									{value}
								</Badge>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						{({ close }) => {
							return (
								<Command tw="w-[clamp(200px, 37vw, 300px)]">
									<CommandInput
										placeholder={typeof column.label === "string" ? column.label : undefined}
										autoFocus
										value={value}
										onValueChange={value => column.setFilterInput(value)}
										onKeyDown={e => {
											if (e.key === "Enter") {
												close()
											}
										}}
									/>
									<div
										tw="absolute right-4 top-[50%] translate-y-[-50%] text-foreground/50 hover:(text-primary cursor-pointer)"
										onClick={column.clearFilter}
									>
										<ResetIcon />
									</div>
								</Command>
							)
						}}
					</PopoverContent>
				</Popover>
				<Button
					variant="outline"
					size="sm"
					tw="border-dashed h-8 border-l-0 rounded-l-none px-2 py-1 text-foreground/50 focus-visible:z-10 hover:(border-solid bg-muted text-primary)"
					onClick={column.toggleFilter}
				>
					<Cross2Icon />
				</Button>
			</div>
		)
	}

	return (
		<div tw="relative flex flex-nowrap">
			<Popover placement="bottom-start">
				<PopoverTrigger>
					<Button
						variant="outline"
						size="sm"
						tw="border-dashed z-10 h-8 rounded-r-none flex gap-2 items-center hover:(border-solid bg-background text-foreground)"
					>
						{children}
						{options.length > 0 && (
							<div tw="flex gap-1">
								{options.map((opt, i) => (
									<Badge key={i} variant="secondary">
										{opt.label}
									</Badge>
								))}
							</div>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<Command tw="w-[clamp(150px, 30vw, 200px)]">
						<CommandInput
							autoFocus
							placeholder={typeof column.label === "string" ? column.label : undefined}
						/>
						<CommandGroup>
							{/* <CommandItem value="-" tw="hidden" /> */}
							{column.filter.map((opt, i) => {
								const selected = new Set(options).has(opt)
								return (
									<CommandItem
										key={i}
										css={style.toolbar.columnView}
										data-state={selected ? "selected" : ""}
										onSelect={() => column.toggleFilterOption(opt)}
									>
										<Checkbox
											checked={selected}
											readOnly
											onClick={() => column.toggleFilterOption(opt)}
										/>
										<span tw="pointer-events-none capitalize">{opt.label}</span>
									</CommandItem>
								)
							})}
						</CommandGroup>
						{(options.length > 0 || value) && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem tw="gap-2" onSelect={column.clearFilter}>
										<ResetIcon />
										Clear
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</Command>
				</PopoverContent>
			</Popover>
			<Button
				variant="outline"
				size="sm"
				tw="border-dashed h-8 border-l-0 rounded-l-none px-2 py-1 text-foreground/50 focus-visible:z-10 hover:(border-solid bg-muted text-primary)"
				onClick={column.toggleFilter}
			>
				<Cross2Icon />
			</Button>
		</div>
	)
}

function TableToolbarFilters<T extends {}>({ filters }: { filters: Record<string, FilterState<T>> }) {
	return Object.entries(filters).map(([id, filterState]) => (
		<FilterButton<T> key={id} {...filterState}>
			<PlusCircledIcon />
			{commandLabel(filterState.column.label)}
		</FilterButton>
	))
}

function TableToolbarColumnView<T extends {}>({ columns }: { columns: TableColumnItem<T>[] }) {
	return (
		<PopoverContent>
			{({ close }) => (
				<Command tw="min-w-[140px]">
					<CommandGroup heading="Toggle columns">
						<CommandList>
							<CommandItem value="-" tw="hidden" />
							{columns.map(({ id, label, selected, canSelected, toggleColumn }) =>
								canSelected ? (
									<CommandItem
										key={id}
										css={style.toolbar.columnView}
										onSelect={() => {
											toggleColumn()
											close()
										}}
										data-state={selected ? "selected" : ""}
									>
										<CheckIcon />
										<span tw="pointer-events-none capitalize">{commandLabel(label)}</span>
									</CommandItem>
								) : null,
							)}
						</CommandList>
					</CommandGroup>
				</Command>
			)}
		</PopoverContent>
	)
}

export function TableToolbar<T extends {}>(context: TableContext<T>) {
	return (
		<div aria-label="table-toolbar" tw="z-10 flex flex-wrap gap-2">
			<div tw="relative grow lg:max-w-[350px]">
				<Input
					placeholder="Search..."
					value={context.globalSearch.value}
					onChange={e => context.globalSearch.setValue(e.target.value)}
					tw="h-8"
				/>
				<div
					tw="absolute right-4 top-[50%] translate-y-[-50%] text-foreground/50 hover:(text-primary cursor-pointer)"
					onClick={context.globalSearch.clearValue}
				>
					<ResetIcon />
				</div>
			</div>
			<Popover placement="bottom-start">
				<PopoverTrigger>
					<Button variant="outline" size="sm" css={style.toolbar.button}>
						<MdiFilterPlusOutlineIcon />
						Add Filter
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<Command tw="min-w-[140px]">
						<CommandGroup heading="Filters">
							<TableToolbarAddFilters<T> filters={context.filters} columns={context.columns} />
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
			<TableToolbarFilters filters={context.filters} />
			<Popover placement="bottom-end">
				<PopoverTrigger>
					<Button variant="outline" size="sm" tw="ml-auto" css={style.toolbar.button}>
						<MixerHorizontalIcon tw="h-4 w-4" />
						<span>View</span>
					</Button>
				</PopoverTrigger>
				<TableToolbarColumnView<T> columns={context.columns} />
			</Popover>
		</div>
	)
}
