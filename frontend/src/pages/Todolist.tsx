import { Button } from "@components/button"
import { FormArrayProvider, useFormArrayContext } from "@components/form/context"
import { isNormalIPv4 } from "@components/form/validate"
import { Input } from "@components/input"
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { animated, easings, useSpringRef, useTransition } from "@react-spring/web"
import { useEffect, useRef } from "react"
import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form"
import { FormattedMessage, useIntl } from "react-intl"

interface TodolistFormData {
	list: { value: string }[]
}

export function TodoList() {
	const methods = useForm<TodolistFormData>({ defaultValues: { list: [] } })
	const fieldArrayMethods = useFieldArray({
		control: methods.control,
		name: "list",
	})

	return (
		<form
			tw="p-5"
			onSubmit={methods.handleSubmit(data => {
				console.log(data)
			})}
		>
			<div tw="flex items-center gap-6">
				<span tw="text-xl">Todolist</span>
				<Button
					onClick={() => {
						fieldArrayMethods.append({ value: "" })
					}}
				>
					<PlusIcon />
					<FormattedMessage id="add" />
				</Button>
			</div>
			<div tw="my-4">
				<div tw="p-3 rounded-lg -mb-2">
					<FormProvider {...methods}>
						<FormArrayProvider {...fieldArrayMethods}>
							<TodolistAnimated />
						</FormArrayProvider>
					</FormProvider>
					<Button type="submit" tw="w-full">
						<FormattedMessage id="apply" />
					</Button>
				</div>
			</div>
		</form>
	)
}

function TodolistAnimated() {
	const {
		register,
		formState: { errors },
	} = useFormContext<TodolistFormData>()
	const intl = useIntl()
	const { fields, remove } = useFormArrayContext<TodolistFormData>()

	const heightMap = useRef<Record<string, number>>({})

	const api = useSpringRef()

	const [transitions] = useTransition(fields.slice(), () => ({
		ref: api,
		keys: item => item.id,
		config: { duration: 200, easing: easings.easeInOutCubic },
		from: {
			opacity: 0.5,
			height: 0,
			transform: "translateX(0%)",
		},
		enter: item => async next => {
			await next({
				opacity: 1,
				height: heightMap.current[item.id],
				transform: "translateX(0%)",
			})
		},
		leave: [{ opacity: 0, transform: "translateX(10%)" }, { height: 0 }],
		onDestroyed(item, key) {
			delete heightMap.current[key]
		},
	}))

	useEffect(() => {
		api.start()
	}, [api, fields])

	return transitions((style, item) => {
		const i = fields.findIndex(v => v.id === item.id)
		return (
			<animated.div style={style}>
				<div
					tw="pb-2"
					ref={(ref: HTMLDivElement) => {
						if (ref) {
							heightMap.current[item.id] = ref.offsetHeight
						}
					}}
				>
					<div tw="flex gap-4">
						<Input
							defaultValue={item.value}
							aria-invalid={errors.list?.[i]?.value != null}
							{...register(`list.${i}.value`, {
								validate: value => {
									if (isNormalIPv4(value, true)) {
										return
									}

									return intl.formatMessage({ id: "invalid_message_000" })
								},
							})}
						/>
						<Button variant="outline" size="icon" onClick={() => remove(i)}>
							<TrashIcon />
						</Button>
					</div>
				</div>
			</animated.div>
		)
	})
}
