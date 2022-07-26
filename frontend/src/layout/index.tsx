import { Toaster } from "@components/toast"
import { Outlet } from "react-router-dom"
import { CommandMenu } from "./CommandMenu"
import { WindowTitleBar } from "./WindowTitleBar"

export function Layout() {
	return (
		<>
			<WindowTitleBar />
			<Root />
		</>
	)
}

function LeftNavigationMenu() {
	return (
		<div tw="top-[calc(var(--control-ratio) * var(--titlebar-height))] sticky h-[calc(100vh - var(--control-ratio) * var(--titlebar-height))]"></div>
	)
}

function Root() {
	return (
		<div id="app-view" tw="relative h-[calc(100vh - var(--control-ratio) * var(--titlebar-height))]">
			<div tw="overflow-auto max-h-[100%]">
				<main tw="animate-enter grid grid-cols-[0 minmax(0, 1fr)]">
					<LeftNavigationMenu />
					<section tw="pt-10">
						<Outlet />
					</section>
				</main>
			</div>
			<CommandMenu />
			<Toaster />
		</div>
	)
}
