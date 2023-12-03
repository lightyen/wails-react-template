import { isElement } from "@components/lib"
import { css } from "@emotion/react"
import { Children, useEffect, useId, useState, type ReactElement } from "react"
import { type NavigateFunction } from "react-router-dom"
import { tw, tx } from "twobj"

const InputControl = tw.input`hidden`

const effects = css`
	${InputControl}:checked + & {
		${tx`text-foreground`}
	}
	${InputControl}:checked + &::after {
		${tx`bg-primary translate-y-px scale-100 opacity-100`}
	}
`

interface RouteTabProps {
	title: ReactElement | string | number
	to: string
}

export function RouteTab(_props: RouteTabProps) {
	return null
}

interface RouterTabsProps {
	children: ReactElement<RouteTabProps> | ReactElement<RouteTabProps>[]
	to?: string
	onNavigate?: NavigateFunction
}

export function RouterTabs({ children, to: propTo, onNavigate }: RouterTabsProps) {
	const id = useId()

	const [stateTo, setTo] = useState(() => propTo)

	const labels = Children.toArray(children).filter((e): e is ReactElement<RouteTabProps> => isElement(e, RouteTab))

	const [indices, setIndices] = useState(() => labels.map((_, i) => id + String(i)))

	useEffect(() => {
		if (propTo) {
			setTo(propTo)
		}
	}, [propTo])

	useEffect(() => {
		if (labels.length !== indices.length) {
			setIndices(labels.map((_, i) => id + String(i)))
		}
	}, [labels, id, indices, setIndices])

	const notMatched = labels.findIndex(({ props: { to } }) => to === stateTo) === -1

	return (
		<div
			tw="pb-3 -mb-3 overflow-auto
				sm:(
					[::-webkit-scrollbar]:(w-[6px] h-[7px])
					[::-webkit-scrollbar-thumb]:(bg-muted-foreground/20 hover:bg-muted-foreground/60)
				)
			"
		>
			<ul tw="text-sm leading-none font-semibold flex whitespace-nowrap bg-transparent -mb-1 border-b">
				{labels.map(({ props: { to, title } }, i) => (
					<li key={indices[i]} tw="-mb-px">
						<InputControl
							type="radio"
							name={id}
							id={indices[i]}
							checked={to === stateTo || (i === 0 && notMatched)}
							onChange={() => {
								if (!propTo) {
									setTo(to)
								}
								onNavigate?.(to, undefined)
							}}
						/>
						<label
							htmlFor={indices[i]}
							tw="select-none
								text-muted-foreground inline-block relative whitespace-nowrap capitalize transition cursor-pointer
								border-b
								px-4 pt-2 pb-3
								after:(translate-y-px h-[2px] absolute left-0 bottom-0 w-full transition-all duration-200 scale-0 opacity-0)
								hover:text-foreground
							"
							css={effects}
						>
							{title}
						</label>
					</li>
				))}
			</ul>
		</div>
	)
}
