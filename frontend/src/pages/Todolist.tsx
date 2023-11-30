import { Button } from "@components/button"
import { Input } from "@components/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { animated, easings, useSpringRef, useTransition } from "@react-spring/web"
import { useEffect, useRef } from "react"
import { FieldArrayWithId, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form"
import { FormattedMessage, useIntl } from "react-intl"
import * as z from "zod"

interface TodolistFormData {
	list: { value: string }[]
}

export function Todolist() {
	const intl = useIntl()
	const schema = z.object({
		list: z.array(
			z.object({
				value: z.string().ip({ version: "v4", message: intl.formatMessage({ id: "invalid_message_000" }) }),
			}),
		),
	})

	const methods = useForm<TodolistFormData>({ resolver: zodResolver(schema), defaultValues: { list: [] } })
	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: "list",
	})

	return (
		<article tw="relative">
			<div tw="max-w-lg">
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
								append({ value: "" })
							}}
						>
							<PlusIcon />
							<FormattedMessage id="add" />
						</Button>
					</div>
					<div tw="my-4">
						<div tw="p-3 rounded-lg -mb-2">
							<FormProvider {...methods}>
								<TodolistAnimated
									fields={fields}
									remove={(id: string) => {
										const i = fields.findIndex(v => v.id === id)
										if (i >= 0) {
											remove(i)
										}
									}}
								/>
							</FormProvider>
							<Button type="submit" tw="w-full">
								<FormattedMessage id="apply" />
							</Button>
						</div>
					</div>
				</form>
			</div>
		</article>
	)
}

function TodolistAnimated({
	fields,
	remove,
}: {
	fields: FieldArrayWithId<TodolistFormData, "list", "id">[]
	remove(id: string): void
}) {
	const {
		register,
		formState: { errors },
	} = useFormContext<TodolistFormData>()

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
					<div tw="flex gap-4 items-center">
						<Input
							defaultValue={item.value}
							aria-invalid={errors.list?.[i]?.value != null}
							{...register(`list.${i}.value`)}
						/>
						<Button
							variant="outline"
							size="icon"
							onClick={() => {
								remove(item.id)
							}}
						>
							<TrashIcon />
						</Button>
					</div>
				</div>
			</animated.div>
		)
	})
}
