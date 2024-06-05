import { EyeNoneIcon, EyeOpenIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { forwardRef, useId, useState, type HTMLAttributes, type InputHTMLAttributes } from "react"
import { tw } from "twobj"

const input = tw`
w-full flex-1 flex h-9 min-h-[34px] text-sm rounded-md border border-input bg-background px-3 shadow-sm transition-colors
file:(border-0 bg-background text-sm font-medium)
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

export const SearchInput = forwardRef<HTMLInputElement, InputProps>(({ type, className, ...props }, ref) => {
	return (
		<div css={input} tw="items-center" className={className}>
			<MagnifyingGlassIcon tw="mr-2 h-4 w-4 shrink-0 opacity-50" />
			<input type={type} ref={ref} tw="grow h-full bg-background outline-none" {...props} />
		</div>
	)
})
SearchInput.displayName = "SearchInput"

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
					tw="w-0 flex-1 focus-visible:outline-none bg-background [::-ms-reveal]:hidden disabled:cursor-not-allowed"
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
