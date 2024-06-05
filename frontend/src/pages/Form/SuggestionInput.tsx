import { commandScore } from "@components/command-score"
import { Input } from "@components/input"
import { Popover, PopoverContent, PopoverTrigger } from "@components/popover"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
	forwardRef,
	startTransition,
	useEffect,
	useMemo,
	useRef,
	useState,
	type InputHTMLAttributes,
	type Key,
} from "react"

export interface Candidate {
	value: string
	alias?: string[]
	key?: Key
}

export interface SuggestionInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onSelect"> {
	candidates: Candidate[]
	onSelect?(v: Candidate): void
}

export const SuggestionInput = forwardRef<HTMLInputElement, SuggestionInputProps>(
	({ candidates, onSelect, onChange, onKeyDown, ...props }, ref) => {
		const innerRef = useRef<HTMLInputElement | null>(null)
		const parentRef = useRef<HTMLDivElement>(null)
		const [searchInput, setSearchInput] = useState("")

		useEffect(() => {
			if (innerRef.current) {
				const value = innerRef.current.value
				setSearchInput(value)
			}
		}, [])

		const [selectedIndex, setSelectedIndex] = useState(-1)
		const [visible, setVisible] = useState(false)
		const hovering = useRef(false)
		const isMounted = useRef(false)
		const typing = useRef(false)
		const keyboard = useRef<Date>(new Date())
		const itemSize = 32

		const suggestions = useMemo(() => {
			interface Result {
				score: number
				value: (typeof candidates)[0]
			}
			const input = searchInput.trim()
			if (!input) {
				return candidates
			}
			const result = candidates
				.map<Result>(c => ({ score: commandScore(c.value, input, c.alias), value: c }))
				.filter(r => r.score > 0)
			result.sort((a, b) => b.score - a.score)
			if (result.length > 0 && result[0].score === 1) {
				setSelectedIndex(0)
			}
			if (isMounted.current) {
				if (typing.current) {
					if (result.length === 0) {
						setVisible(false)
					} else {
						setVisible(true)
					}
				}
			}
			return result.map(c => c.value)
		}, [searchInput, candidates])

		const after = useRef("")

		function handleSelect(s: Candidate) {
			typing.current = false
			onSelect?.(s)
		}

		useEffect(() => {
			isMounted.current = true
		}, [])

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
			overscan: 10,
		})

		return (
			<Popover
				placement="bottom-start"
				visible={visible}
				setVisible={setVisible}
				onLeave={() => {
					if (after.current) {
						setSearchInput(after.current)
						after.current = ""
					}
				}}
			>
				<PopoverTrigger mode="none">
					<Input
						ref={node => {
							innerRef.current = node
							if (typeof ref === "function") {
								ref(node)
							} else if (ref) {
								ref.current = node
							}
						}}
						onFocus={() => {
							if (suggestions.length > 0) {
								setVisible(true)
							}
						}}
						onChange={e => {
							onChange?.(e)
							const value = e.target.value
							typing.current = true
							startTransition(() => {
								setSearchInput(value)
								setSelectedIndex(-1)
							})
						}}
						onKeyDown={e => {
							switch (e.key) {
								case "Enter": {
									typing.current = false
									if (visible && innerRef.current) {
										const s = suggestions[selectedIndex]
										const currentValue = innerRef.current.value
										if (s && s.value !== currentValue) {
											handleSelect(s)
											setSearchInput(s.value)
											e.preventDefault()
										} else {
											setVisible(false)
										}
									}
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
							if (e.ctrlKey && e.key === "i") {
								if (suggestions.length > 0) {
									setVisible(true)
								}
								e.preventDefault()
								return
							}

							onKeyDown?.(e)
						}}
						{...props}
					/>
				</PopoverTrigger>
				<PopoverContent>
					<div
						tw="overflow-hidden rounded-lg bg-background border shadow-lg p-1"
						onBlur={e => {
							const lastChild = parentRef.current?.firstChild?.lastChild
							if (lastChild === e.target) {
								setVisible(false)
							}
						}}
					>
						<div
							ref={parentRef}
							aria-label="candidates"
							tw="overscroll-none h-[260px] w-[300px] overflow-auto"
						>
							<div tw="relative" css={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
								{rowVirtualizer.getVirtualItems().map(({ start, index, key, size }) => {
									const data = suggestions[index]
									const k = data.key ?? key
									return (
										<button
											key={k}
											type="button"
											tw="absolute top-0 left-0 w-full
											aria-selected:(bg-primary/10 text-primary/80 cursor-pointer)
											focus-within:(bg-primary/15 outline-none)
											px-1 flex items-center "
											css={{ height: `${size}px`, transform: `translateY(${start}px)` }}
											aria-selected={index === selectedIndex}
											onMouseOver={() => {
												const now = new Date()
												if (now.getTime() - keyboard.current.getTime() > 33) {
													hovering.current = true
													setSelectedIndex(index)
												}
											}}
											onClick={() => {
												hovering.current = false
												handleSelect(data)
												after.current = data.value
												setVisible(false)
											}}
										>
											{data.value}
										</button>
									)
								})}
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		)
	},
)
