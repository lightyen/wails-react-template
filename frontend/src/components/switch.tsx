import { css } from "@emotion/react"
import { forwardRef, useId, useRef, type InputHTMLAttributes } from "react"
import { tw, tx } from "twobj"

const InputControl = tw.input`hidden`

const effects = css`
	${InputControl}:disabled + & {
		${tx`cursor-not-allowed opacity-50`}
	}
	${InputControl}:checked + & {
		${tx`bg-primary`}
	}
	${InputControl}:checked + &::after {
		${tx`translate-x-4`}
	}
`

export const Switch = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
	({ id, className, onFocus, onBlur, onKeyDown, ...props }, ref) => {
		const innerId = useId()
		const inputRef = useRef<HTMLInputElement | null>(null)
		const isFocus = useRef(false)
		if (!id) id = innerId
		return (
			<>
				<InputControl
					ref={el => {
						inputRef.current = el
						if (typeof ref === "function") {
							ref(el)
						} else if (ref) {
							ref.current = el
						}
					}}
					id={id}
					type="checkbox"
					{...props}
				/>
				<label
					htmlFor={id}
					tabIndex={0}
					role="checkbox"
					tw="inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full
						border-2 border-transparent shadow-sm transition-colors
						bg-input
						focus-visible:(outline-none ring-2 ring-ring ring-offset-2 ring-offset-background)
						after:(pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 ring-offset-0 transition-transform)
					"
					css={effects}
					className={className}
					onFocus={_ => {
						isFocus.current = true
					}}
					onBlur={_ => {
						isFocus.current = false
					}}
					onKeyDown={e => {
						if (!isFocus.current || !inputRef.current) {
							return
						}
						const isSpace = e.key == " " || e.code == "Space"
						if (isSpace || e.key == "Enter") {
							e.preventDefault()
							inputRef.current.checked = !inputRef.current.checked
						}
					}}
				></label>
			</>
		)
	},
)
Switch.displayName = "Switch"
