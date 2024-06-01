import { createContext, useContext, type PropsWithChildren } from "react"
import type { FieldArrayPath, FieldValues, UseFieldArrayReturn } from "react-hook-form"

const FormArrayContext = createContext<unknown>(null)

export function FormArrayProvider<
	TFieldValues extends FieldValues = FieldValues,
	TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
	TKeyName extends string = "id",
>({ children, ...methods }: PropsWithChildren<UseFieldArrayReturn<TFieldValues, TFieldArrayName, TKeyName>>) {
	return <FormArrayContext.Provider value={methods}>{children}</FormArrayContext.Provider>
}

export function useFormArrayContext<
	TFieldValues extends FieldValues = FieldValues,
	TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
	TKeyName extends string = "id",
>() {
	return useContext(FormArrayContext) as UseFieldArrayReturn<TFieldValues, TFieldArrayName, TKeyName>
}
