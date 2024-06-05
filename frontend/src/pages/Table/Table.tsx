import { Checkbox } from "@components/checkbox"
import { Provider, TablePagination, TableToolbar, TableView, useTable } from "@components/table"
import { useEffect, useState } from "react"
import { MockRecord, data } from "~/data/data"

export function Component() {
	// API like
	const [source, setSource] = useState<MockRecord[]>(data)
	// useEffect(() => {
	// 	setSource(data)
	// }, [source])

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		setSource([])
	// 	}, 5000)
	// }, [])

	const store = useTable({
		source,
		// persistedId: "table01",
		columns: [
			{
				id: "checkbox",
				label: ({ intermediate, checked, onChecked }) => (
					<Checkbox
						intermediate={intermediate}
						checked={checked}
						onChange={e => onChecked(e.target.checked)}
					/>
				),
				canSelected: false,
				Component: ({ checked, onChecked }) => {
					return <Checkbox checked={checked} onChange={e => onChecked(e.target.checked)} />
				},
			},
			{
				id: "name",
				label: "Name",
				compare: (a, b) => a.name.localeCompare(b.name),
				filter: (record, value, search) => search(record.name, value),
			},
			{
				id: "country",
				label: "Country",
				filter: [
					{ label: "Germany", filter: v => v.country === "Germany" },
					{ label: "Ukraine", filter: v => v.country === "Ukraine" },
					{ label: "France", filter: v => v.country === "France" },
				],
			},
			{ id: "region", label: "Region", selected: false },
			{
				id: "currency",
				label: "Currency",
				compare: (a, b) => {
					return parseFloat(a.currency.slice(1)) - parseFloat(b.currency.slice(1))
				},
			},
			{
				id: "email",
				label: "Email",
				filter: (record, value, search) => search(record.email, value),
			},
			{
				id: "alphanumeric",
				label: "Alphanumeric",
				selected: false,
				compare: (a, b) => a.alphanumeric.localeCompare(b.alphanumeric),
			},
			{
				id: "text",
				label: "Text",
				selected: false,
				filter: (record, value, search) => search(record.text, value),
			},
		],
	})

	const reset = store(state => state.reset)

	useEffect(() => {
		reset(source)
	}, [reset, source])

	return (
		<div tw="px-5 max-w-3xl lg:max-w-max mx-auto grid gap-4">
			<Provider store={store}>
				<TableToolbar />
				<TableView />
				<TablePagination />
			</Provider>
		</div>
	)
}
