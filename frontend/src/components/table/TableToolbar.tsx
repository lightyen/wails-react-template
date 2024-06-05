import { CheckIcon, Cross2Icon, MixerHorizontalIcon, ResetIcon } from "@radix-ui/react-icons"
import { type PropsWithChildren, type SVGProps } from "react"
import { useTableStore } from "."
import { Badge } from "../badage"
import { Button } from "../button"
import { Checkbox } from "../checkbox"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../command"
import { Input } from "../input"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../popover"
import type { Label, SelectFilterState, TextFilterState } from "./context/model"

function CommandLabel({ Label }: { Label: Label }) {
	if (typeof Label === "string") {
		return Label
	}
	if (typeof Label !== "function") {
		return Label
	}
	return null
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

function TableToolbarAddFilters() {
	const useSelect = useTableStore()
	const columns = useSelect(state => state.columns)
	const filters = useSelect(state => state.filters)
	const addFilter = useSelect(state => state.addFilter)
	const removeFilter = useSelect(state => state.removeFilter)
	return (
		<PopoverClose>
			<CommandList>
				<CommandItem value="-" tw="hidden" />
				{columns.map(({ id, label, filter }) => {
					const filterId = id
					return filter && id !== "checkbox" ? (
						<CommandItem
							key={id}
							tw="flex gap-2 [& svg]:invisible [&[data-state=selected] svg]:visible"
							onSelect={() => {
								if (filters[filterId]) {
									removeFilter(filterId)
								} else {
									addFilter(filterId, label, filter)
								}
							}}
							data-state={filters[filterId] ? "selected" : ""}
						>
							<CheckIcon />
							<span tw="pointer-events-none capitalize">
								<CommandLabel Label={label} />
							</span>
						</CommandItem>
					) : null
				})}
			</CommandList>
		</PopoverClose>
	)
}

function FilterText<T extends {}>({ children, filter }: PropsWithChildren<{ filter: TextFilterState<T> }>) {
	const useSelect = useTableStore()
	const setFilterText = useSelect(state => state.setFilterText)
	const clearFilter = useSelect(state => state.clearFilter)
	const removeFilter = useSelect(state => state.removeFilter)

	return (
		<div tw="relative flex flex-nowrap">
			<Popover placement="bottom-start">
				<PopoverTrigger>
					<Button
						variant="outline"
						size="sm"
						tw="border-dashed z-10 rounded-r-none flex gap-1 items-center hover:(border-solid bg-background text-foreground)"
					>
						{children}
						{filter.value && (
							<Badge variant="secondary" tw="whitespace-pre">
								{filter.value}
							</Badge>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					{({ close }) => {
						return (
							<Command tw="w-[clamp(200px, 37vw, 300px)]">
								<CommandList>
									<CommandInput
										placeholder={typeof filter.label === "string" ? filter.label : undefined}
										autoFocus
										value={filter.value}
										onValueChange={value => setFilterText(filter.id, value)}
										onKeyDown={e => {
											if (e.key === "Enter") {
												close()
											}
										}}
									/>
									<div
										tw="absolute right-4 top-[50%] translate-y-[-50%] text-foreground/50 hover:(text-primary cursor-pointer)"
										onClick={() => clearFilter(filter.id)}
									>
										<ResetIcon />
									</div>
								</CommandList>
							</Command>
						)
					}}
				</PopoverContent>
			</Popover>
			<Button
				variant="outline"
				size="sm"
				tw="border-dashed border-l-0 rounded-l-none px-2 py-1 text-foreground/50 focus-visible:z-10 hover:(border-solid bg-muted text-primary)"
				onClick={() => removeFilter(filter.id)}
			>
				<Cross2Icon />
			</Button>
		</div>
	)
}

function FilterOptions<T extends {}>({ children, filter }: PropsWithChildren<{ filter: SelectFilterState<T> }>) {
	const useSelect = useTableStore()
	const clearFilter = useSelect(state => state.clearFilter)
	const removeFilter = useSelect(state => state.removeFilter)
	const toggleFilterOption = useSelect(state => state.toggleFilterOption)

	return (
		<div tw="relative flex flex-nowrap">
			<Popover placement="bottom-start">
				<PopoverTrigger>
					<Button
						variant="outline"
						size="sm"
						tw="border-dashed z-10 rounded-r-none flex gap-2 items-center hover:(border-solid bg-background text-foreground)"
					>
						{children}
						{filter.value.length > 0 && (
							<div tw="flex gap-1">
								{filter.value.map((opt, i) => (
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
							placeholder={typeof filter.label === "string" ? filter.label : undefined}
						/>
						<CommandList>
							<CommandGroup>
								{/* <CommandItem value="-" tw="hidden" /> */}
								{filter.options.map((opt, i) => {
									const selected = new Set(filter.value).has(opt)
									return (
										<CommandItem
											key={i}
											tw="flex gap-2 [& svg]:invisible [&[data-state=selected] svg]:visible"
											data-state={selected ? "selected" : ""}
											onSelect={() => toggleFilterOption(filter.id, opt)}
										>
											<Checkbox
												checked={selected}
												readOnly
												onClick={() => toggleFilterOption(filter.id, opt)}
											/>
											<span tw="pointer-events-none capitalize">{opt.label}</span>
										</CommandItem>
									)
								})}
							</CommandGroup>
							{filter.value.length > 0 && (
								<>
									<CommandSeparator />
									<CommandGroup>
										<CommandItem tw="gap-2" onSelect={() => clearFilter(filter.id)}>
											<ResetIcon />
											Clear
										</CommandItem>
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<Button
				variant="outline"
				size="sm"
				tw="border-dashed border-l-0 rounded-l-none px-2 py-1 text-foreground/50 focus-visible:z-10 hover:(border-solid bg-muted text-primary)"
				onClick={() => removeFilter(filter.id)}
			>
				<Cross2Icon />
			</Button>
		</div>
	)
}

function TableToolbarFilters() {
	const useSelect = useTableStore()
	const filters = useSelect(state => state.filters)
	return Object.entries(filters).map(([id, filter]) => {
		if (filter.type === "text") {
			return (
				<FilterText key={id} filter={filter}>
					<CommandLabel Label={filter.label} />
				</FilterText>
			)
		}
		return (
			<FilterOptions key={id} filter={filter}>
				<CommandLabel Label={filter.label} />
			</FilterOptions>
		)
	})
}

function TableToolbarColumnView() {
	const useSelect = useTableStore()
	const columns = useSelect(state => state.columns)
	const selectColumn = useSelect(state => state.selectColumn)
	return (
		<PopoverContent>
			{({ close }) => (
				<Command tw="min-w-[140px]">
					<CommandList>
						<CommandGroup heading="Toggle columns">
							<CommandItem value="-" tw="hidden" />
							{columns.map(({ label, selected, canSelected }, columnIndex) => {
								if (!canSelected) {
									return null
								}
								return (
									<CommandItem
										key={columnIndex}
										tw="flex gap-2 [& svg]:invisible [&[data-state=selected] svg]:visible"
										onSelect={() => {
											selectColumn(columnIndex, selected => !selected)
											close()
										}}
										data-state={selected ? "selected" : ""}
									>
										<CheckIcon />
										<span tw="pointer-events-none capitalize">
											<CommandLabel Label={label} />
										</span>
									</CommandItem>
								)
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			)}
		</PopoverContent>
	)
}

export function TableToolbar() {
	const useSelect = useTableStore()
	const setGlobalSearch = useSelect(state => state.setGlobalSearch)
	const value = useSelect(state => state.global.value)
	return (
		<div aria-label="table-toolbar" tw="z-10 flex flex-wrap gap-2">
			<div tw="relative grow lg:max-w-[350px]">
				<Input
					tw="h-[34px]"
					placeholder="Search..."
					value={value}
					onChange={e => setGlobalSearch(e.target.value)}
				/>
				<div
					tw="absolute right-4 top-[50%] translate-y-[-50%] text-foreground/50 hover:(text-primary cursor-pointer)"
					onClick={() => setGlobalSearch("")}
				>
					<ResetIcon />
				</div>
			</div>
			<Popover placement="bottom-start">
				<PopoverTrigger>
					<Button variant="outline" size="sm" tw="px-3 flex gap-2 justify-between items-center">
						<MdiFilterPlusOutlineIcon />
						Add Filter
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<Command tw="min-w-[140px]">
						<CommandGroup heading="Filters">
							<TableToolbarAddFilters />
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
			<TableToolbarFilters />
			<Popover placement="bottom-end">
				<PopoverTrigger>
					<Button variant="outline" size="sm" tw="ml-auto px-3 flex gap-2 justify-between items-center">
						<MixerHorizontalIcon tw="h-4 w-4" />
						<span>View</span>
					</Button>
				</PopoverTrigger>
				<TableToolbarColumnView />
			</Popover>
		</div>
	)
}
