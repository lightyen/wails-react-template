import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { forwardRef, useId, useState, type HTMLAttributes, type InputHTMLAttributes } from "react"
import { tw } from "twobj"

const input = tw`
w-full flex-1 flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors
file:(border-0 bg-transparent text-sm font-medium)
placeholder:text-muted-foreground
focus-within:(outline-none ring-1 ring-ring)
disabled:(cursor-not-allowed opacity-50)
[&[aria-invalid=true]]:(ring-1 ring-destructive bg-destructive/10)
`

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ type, ...props }, ref) => {
	return <input type={type} css={input} ref={ref} {...props} />
})
Input.displayName = "Input"

export const Password = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
	({ id, "aria-invalid": invalid, disabled, type: _, className, ...props }, ref) => {
		const innerId = useId()
		if (!id) id = innerId
		const [reveal, setReveal] = useState(false)
		return (
			<div css={input} aria-invalid={invalid}>
				<input
					ref={ref}
					id={id}
					autoComplete="off"
					autoCorrect="off"
					spellCheck="false"
					tabIndex={0}
					tw="w-0 flex-1 focus-visible:outline-none bg-transparent [::-ms-reveal]:hidden disabled:cursor-not-allowed"
					type={reveal ? "text" : "password"}
					disabled={disabled}
					aria-invalid={invalid}
					{...props}
				/>
				<button
					type="button"
					tabIndex={-1}
					disabled={disabled}
					tw="text-muted-foreground p-1 focus:outline-none transition rounded-lg disabled:(pointer-events-none cursor-not-allowed text-muted)"
					onClick={() => setReveal(t => !t)}
				>
					{reveal ? <EyeOpenIcon /> : <EyeNoneIcon />}
				</button>
			</div>
		)
	},
)

export const ErrorFeedBack = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>((props, ref) => {
	return <p tw="text-[0.8rem] font-medium text-destructive" ref={ref} {...props} />
})
ErrorFeedBack.displayName = "ErrorFeedBack"
