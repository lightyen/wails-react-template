import { css } from "@emotion/react"
import { tw } from "twobj"

export const style = {
	tableBorder: css(tw`rounded-md border overflow-x-auto`),
	tableWrapper: css(tw`relative w-full`),
	table: css(tw`w-full caption-bottom text-sm whitespace-nowrap`),
	thead: css(tw`[& tr]:border-b`),
	tbody: css(tw`[& tr:last-of-type]:border-0`),
	tr: css(tw`border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted`),
	th: css(
		tw`h-10 px-2 first-of-type:pl-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-2`,
	),
	td: css(tw`p-2 first-of-type:pl-4 align-middle [&:has([role=checkbox])]:pr-2`),
	tfoot: css(tw`bg-primary font-medium text-primary-foreground`),
	sortIcon: css(tw`ml-2 h-4 w-4`),
	toolbar: {
		button: css(tw`px-3 h-8 flex gap-2 justify-between items-center`),
		columnView: css(tw`flex gap-2 [& svg]:invisible [&[data-state=selected] svg]:visible`),
	},
	pagination: {
		last: css(tw`hidden h-8 w-8 p-0 lg:flex`),
		next: css(tw`h-8 w-8 p-0`),
		icon: css(tw`h-4 w-4`),
		sortItem: css(tw`flex gap-2`),
		limitItem: css(tw`flex justify-between [& svg]:invisible [&[data-state=selected] svg]:visible`),
	},
}
