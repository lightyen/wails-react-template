import * as calc from "wails/features/Calc"

import { css } from "@emotion/react"
import { useState } from "react"
import { useAction, useSelect } from "./store"
import { TitleBar } from "./TitleBar"

function MD5Form() {
	const [inputText, setText] = useState("")
	const [response, setResponse] = useState("")
	return (
		<form
			tw="px-5 py-4 mb-3 border border-gray-800"
			onSubmit={e => {
				e.preventDefault()
				calc.MD5(inputText).then(resp => setResponse(resp))
			}}
		>
			<input
				tw="py-2 px-3 w-[375px] focus-within:outline-none bg-slate-900"
				placeholder="md5sum"
				onChange={e => setText(e.target.value)}
				value={inputText}
			/>
			<button type="submit" tw="bg-black text-white px-3 py-2 hover:scale-105 duration-150">
				Submit
			</button>
			<p tw="py-2 min-h-[52px] flex items-end">{response}</p>
		</form>
	)
}

function Buttons() {
	const { openFile, openDirectory } = useAction().app
	return (
		<div tw="flex gap-4">
			<button type="button" tw="mb-3 px-3 py-1 bg-pink-900 hover:bg-pink-800 duration-150" onClick={openFile}>
				Open an image
			</button>
			<button
				type="button"
				tw="mb-3 px-3 py-1 bg-pink-900 hover:bg-pink-800 duration-150"
				onClick={openDirectory}
			>
				Open directory
			</button>
		</div>
	)
}

function Demo() {
	const images = useSelect(state => state.app.images)
	return (
		<div tw="pt-3 pb-1">
			{images &&
				(Array.isArray(images) ? (
					images.map(src => <img key={src} src={"/img/" + src} />)
				) : (
					<img key={images} tw="w-full" src={"/img/" + images} />
				))}
		</div>
	)
}

const customScrollbar = css`
	overflow: auto;
	::-webkit-scrollbar-track {
		display: none;
	}
	::-webkit-scrollbar {
		width: 6px;
		height: 4px;
		background-color: rgb(0 0 0 / 0.2);
	}
	::-webkit-scrollbar-thumb {
		border: 1px solid transparent;
		box-shadow: inset 0 0 0 100px rgb(165 243 252 / 0.5);
	}
`

export function Main() {
	return (
		<div tw="h-screen relative flex flex-col">
			<TitleBar tw="grow-0 shrink-0" />
			<div
				tw="h-[calc(100% - var(--titlebar-height))] px-1 bg-gradient-to-b from-gray-900 to-gray-700 text-gray-50"
				onDragOver={e => {
					e.preventDefault()
				}}
				onDrop={e => {
					e.preventDefault()
				}}
			>
				<div tw="max-h-full" css={customScrollbar}>
					<div tw="flex flex-col items-center pt-3">
						<Buttons />
						<MD5Form />
						<Demo />
					</div>
				</div>
			</div>
		</div>
	)
}
