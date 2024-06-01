import { Button } from "@components/button"
import { isNormalIPv4 } from "@components/form/validate"
import { Input } from "@components/input"
import { InputHTMLAttributes, forwardRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

interface FormData {
	ipv4: string
	x: number
	y: number
}

function validateData(data: FormData): boolean {
	return Number(data.x) + Number(data.y) <= 100
}

export function FormComponent() {
	const methods = useForm<FormData>({
		defaultValues: {
			ipv4: "10.1.1.1",
			x: 0,
			y: 0,
		},
	})

	return (
		<div tw="py-7 flex flex-col gap-7">
			<div tw="max-w-xl">
				<h1 tw="font-bold text-lg mb-4">Form</h1>
				<FormProvider {...methods}>
					<DemoForm />
				</FormProvider>
			</div>
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

function DemoForm() {
	const { register, handleSubmit, formState, getValues, setError, clearErrors } = useForm<FormData>()
	const { errors, isSubmitted } = formState
	const [output, setOutput] = useState("")
	return (
		<form
			tw="grid gap-4 max-w-[600px]"
			onSubmit={handleSubmit(data => {
				if (!validateData(data)) {
					setError("x", { type: "validate" })
					setError("y", { type: "validate" })
					return
				}
				setOutput(JSON.stringify(data))
			})}
		>
			<Input
				placeholder="ipv4"
				aria-invalid={errors.ipv4 != null}
				{...register("ipv4", { validate: value => isNormalIPv4(value, true) })}
			/>
			<PercentInput
				placeholder="x"
				aria-invalid={errors.x != null}
				{...register("x", {
					onChange() {
						if (!isSubmitted) {
							return
						}
						if (!validateData(getValues())) {
							setError("x", { type: "validate" })
							setError("y", { type: "validate" })
							return
						}
						clearErrors("x")
						clearErrors("y")
					},
				})}
			/>
			<PercentInput
				placeholder="y"
				aria-invalid={errors.y != null}
				{...register("y", {
					onChange() {
						if (!isSubmitted) {
							return
						}
						if (!validateData(getValues())) {
							setError("x", { type: "validate" })
							setError("y", { type: "validate" })
							return
						}
						clearErrors("x")
						clearErrors("y")
					},
				})}
			/>
			{output && <p>{output}</p>}
			<Button type="submit">Apply</Button>
		</form>
	)
}
