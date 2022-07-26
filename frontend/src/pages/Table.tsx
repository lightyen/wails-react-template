import { Checkbox } from "@components/checkbox"
import { TablePagination, TableToolbar, TableView, useTableData } from "@components/table"
import { data } from "./data"

export function Table() {
	const { toolbarContext, viewContext, paginationContext } = useTableData(data, {
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
			{ id: "region", label: "Region", defaultSelected: false },
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
				defaultSelected: false,
				compare: (a, b) => a.alphanumeric.localeCompare(b.alphanumeric),
			},
			{
				id: "text",
				label: "Text",
				defaultSelected: false,
				filter: (record, value, search) => search(record.text, value),
			},
		],
	})
	return (
		<div tw="px-5 max-w-3xl lg:max-w-max mx-auto grid gap-4">
			<TableToolbar {...toolbarContext} />
			<TableView {...viewContext} />
			<TablePagination {...paginationContext} />
		</div>
	)
}
