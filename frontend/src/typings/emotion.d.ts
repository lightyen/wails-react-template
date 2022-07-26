import { type Interpolation } from "@emotion/react"
import {} from "react"

declare global {
	type Theme = unknown
}

declare module "react" {
	interface Attributes {
		css?: Interpolation
	}
}
