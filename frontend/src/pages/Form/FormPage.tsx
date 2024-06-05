import { Button } from "@components/button"
import { Checkbox } from "@components/checkbox"
import { commandScore } from "@components/command-score"
import { isNormalIPv4, parseMAC } from "@components/form/validate"
import { Input, SearchInput } from "@components/input"
import { Label } from "@components/label"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@components/popover"
import { Switch } from "@components/switch"
import { useVirtualizer } from "@tanstack/react-virtual"
import { InputHTMLAttributes, forwardRef, startTransition, useEffect, useId, useMemo, useRef, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { addresses } from "~/data/macaddr"
import { zonenames } from "~/data/zonename"
import { Header, Separator } from "~/pages/common"
import { Candidate, SuggestionInput } from "./SuggestionInput"

export function Component() {
	return (
		<article tw="max-w-3xl ml-[25%] mr-[20%] pt-6 pb-20">
			<Header>Input</Header>
			<InputView />
			<Separator />
			<Header>Switch</Header>
			<SwitchView />
			<Separator />
			<Header>Checkbox</Header>
			<CheckboxView />
			<Separator />
			<Header>Select</Header>
			<ZonenameSelect />
			<Separator />
			<Header>Suggestion</Header>
			<SuggestionView />
			<Separator />
			<Header>Form</Header>
			<FormView />
		</article>
	)
}

function InputView() {
	const id = useId()
	return (
		<div tw="max-w-xl">
			<Label htmlFor={id} tw="mb-1 mt-3 text-lg">
				Field
			</Label>
			<Input id={id} placeholder="some text" />
		</div>
	)
}

function SwitchView() {
	const id = useId()
	return (
		<div tw="max-w-xl">
			<div tw="flex items-center gap-2">
				<Switch id={id} />
				<Label htmlFor={id}>on/off</Label>
			</div>
		</div>
	)
}

function CheckboxView() {
	const id = useId()
	return (
		<div tw="max-w-xl">
			<div tw="flex items-center gap-2">
				<Checkbox id={id} />
				<Label htmlFor={id}>Enable</Label>
			</div>
		</div>
	)
}

function ZonenameSelect() {
	const [value, setValue] = useState("Africa/Abidjan")

	const parentRef = useRef<HTMLDivElement>(null)

	const [searchInput, setSearchInput] = useState("")

	const suggestions = useMemo(() => {
		const input = searchInput.trim()
		if (!input) {
			return zonenames
		}
		interface Result {
			score: number
			value: (typeof zonenames)[0]
		}

		const ans = zonenames
			.map<Result>(value => ({ score: commandScore(value, input, []), value }))
			.filter(value => value.score > 0)

		ans.sort((a, b) => {
			return b.score - a.score
		})

		return ans.map(s => s.value)
	}, [searchInput])

	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (visible) {
			setSelectedIndex(-1)
		}
	}, [visible])

	const hovering = useRef(false)
	const keyboard = useRef<Date>(new Date())

	const itemSize = 32

	useEffect(() => {
		const scrollbox = parentRef.current
		if (scrollbox && selectedIndex >= 0 && !hovering.current) {
			if (selectedIndex * itemSize < scrollbox.scrollTop) {
				scrollbox.scrollTo({ top: selectedIndex * itemSize })
			} else if ((selectedIndex + 1) * itemSize > scrollbox.scrollTop + scrollbox.offsetHeight) {
				scrollbox.scrollTo({ top: (selectedIndex + 1) * itemSize - scrollbox.offsetHeight })
			}
		}
	}, [selectedIndex])

	const rowVirtualizer = useVirtualizer({
		count: suggestions.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => itemSize,
		overscan: 30,
	})

	return (
		<Popover
			placement="bottom-start"
			visible={visible}
			setVisible={setVisible}
			onLeave={() => {
				setSearchInput("")
			}}
		>
			<PopoverTrigger>
				<Button variant="outline">{value}</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div tw="rounded-md border shadow-lg overflow-hidden">
					<SearchInput
						tw="focus-within:ring-0 border-0 border-b rounded-b-none"
						onChange={e => {
							const value = e.target.value
							startTransition(() => setSearchInput(value))
						}}
						onKeyDown={e => {
							switch (e.key) {
								case "Enter": {
									const value = suggestions[selectedIndex]
									if (value) {
										setValue(value)
										setVisible(false)
									}
									e.preventDefault()
									return
								}
								case "ArrowDown":
									if (selectedIndex < suggestions.length - 1) {
										hovering.current = false
										keyboard.current = new Date()
										setSelectedIndex(index => index + 1)
									}
									e.preventDefault()
									return
								case "ArrowUp":
									if (selectedIndex > 0) {
										hovering.current = false
										keyboard.current = new Date()
										setSelectedIndex(index => index - 1)
									}
									e.preventDefault()
									return
							}
						}}
						onBlur={() => {
							setVisible(false)
						}}
						autoFocus
					/>
					<PopoverClose>
						<div
							aria-label="scroll-container"
							ref={parentRef}
							tw="overflow-auto overscroll-contain max-h-[250px] w-[300px] bg-background"
						>
							<div
								aria-label="items"
								tw="relative w-full whitespace-nowrap"
								css={{ height: `${rowVirtualizer.getTotalSize()}px` }}
							>
								{rowVirtualizer.getVirtualItems().map(({ key, index, size, start }) => {
									const data = suggestions[index]
									return (
										<div
											key={key}
											tw="absolute top-0 left-0 w-full
												flex items-center px-3
												aria-selected:(bg-primary/10 text-primary/80 cursor-pointer)
												"
											aria-selected={index === selectedIndex}
											css={{ height: `${size}px`, transform: `translateY(${start}px)` }}
											onMouseOver={() => {
												const now = new Date()
												if (now.getTime() - keyboard.current.getTime() > 33) {
													hovering.current = true
													setSelectedIndex(index)
												}
											}}
											onClick={() => {
												hovering.current = false
												setValue(data)
												setVisible(false)
												setSelectedIndex(-1)
											}}
										>
											{data}
										</div>
									)
								})}
							</div>
						</div>
					</PopoverClose>
				</div>
			</PopoverContent>
		</Popover>
	)
}

function SuggestionView() {
	const [candidates] = useState(() => addresses.map<Candidate>(v => ({ value: v })))
	const ref = useRef<HTMLInputElement>(null)
	const id = useId()
	return (
		<div tw="max-w-xl">
			<Label htmlFor={id} tw="mb-1 mt-3 text-lg">
				MAC
			</Label>
			<SuggestionInput
				ref={ref}
				id={id}
				candidates={candidates}
				onSelect={({ value }) => {
					if (ref.current) {
						ref.current.value = value
					}
				}}
			/>
		</div>
	)
}

interface MyFormData {
	ipaddr: string
	x: number
	y: number
	mac: string
}

function validateData(data: MyFormData): boolean {
	return Number(data.x) + Number(data.y) <= 100
}

export function FormView() {
	const methods = useForm<MyFormData>({
		defaultValues: {
			ipaddr: "10.1.1.1",
			x: 56,
			y: 12,
			mac: "aa:bb:cc:dd:ee:ff",
		},
	})
	const [output, setOutput] = useState("")
	return (
		<div tw="max-w-xl">
			<form
				tw="grid gap-4"
				onSubmit={methods.handleSubmit(data => {
					if (!validateData(data)) {
						methods.setError("x", { type: "validate" })
						methods.setError("y", { type: "validate" })
						return
					}
					setOutput(JSON.stringify(data, null, 2))
				})}
			>
				<FormProvider {...methods}>
					<FormDetail />
				</FormProvider>
				<Button type="submit">Apply</Button>
			</form>
			{output && (
				<pre tw="my-4">
					<code>{output}</code>
				</pre>
			)}
		</div>
	)
}

const PercentInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
	return (
		<div tw="flex items-center relative">
			<Input tw="pr-6" ref={ref} {...props} />
			<span tw="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none text-foreground/30">%</span>
		</div>
	)
})
PercentInput.displayName = "PercentInput"

function FormDetail() {
	const methods = useFormContext<MyFormData>()
	const { errors, isSubmitted } = methods.formState
	const [candidates] = useState(() => addresses.map<Candidate>(v => ({ value: v })))
	return (
		<>
			<Input
				placeholder="IPv4"
				aria-invalid={errors.ipaddr != null}
				{...methods.register("ipaddr", { validate: value => isNormalIPv4(value, true) })}
			/>
			<PercentInput
				placeholder="x"
				aria-invalid={errors.x != null}
				{...methods.register("x", {
					onChange() {
						if (!isSubmitted) {
							return
						}
						if (!validateData(methods.getValues())) {
							methods.setError("x", { type: "validate" })
							methods.setError("y", { type: "validate" })
							return
						}
						methods.clearErrors("x")
						methods.clearErrors("y")
					},
				})}
			/>
			<PercentInput
				placeholder="y"
				aria-invalid={errors.y != null}
				{...methods.register("y", {
					onChange() {
						if (!isSubmitted) {
							return
						}
						if (!validateData(methods.getValues())) {
							methods.setError("x", { type: "validate" })
							methods.setError("y", { type: "validate" })
							return
						}
						methods.clearErrors("x")
						methods.clearErrors("y")
					},
				})}
			/>
			<SuggestionInput
				candidates={candidates}
				aria-invalid={errors.mac != null}
				onSelect={({ value }) => {
					methods.setValue("mac", value)
					methods.trigger("mac")
				}}
				{...methods.register("mac", { validate: value => parseMAC(value) != null })}
			/>
		</>
	)
}
