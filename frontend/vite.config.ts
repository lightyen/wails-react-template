import yaml from "@rollup/plugin-yaml"
import react from "@vitejs/plugin-react"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import license from "rollup-plugin-license"
import { defineConfig, type PluginOption } from "vite"
import eslint from "vite-plugin-eslint"
import svg from "vite-plugin-svgr"
import tsConfigPaths from "vite-plugin-tsconfig-paths"
import tailwindConfig from "./tailwind.config"

function gitcommit(): PluginOption {
	return {
		name: "git-commit",
		enforce: "post",
		async buildEnd(err) {
			if (process.env.NODE_ENV !== "production") {
				return
			}
			if (err != null) {
				return
			}
			try {
				const result = await promisify(exec)("git rev-parse --verify HEAD")
				this.emitFile({
					type: "asset",
					name: "version",
					fileName: "version",
					source: result.stdout.trim(),
				})
			} catch {}
		},
	}
}

export default defineConfig({
	plugins: [
		gitcommit(),
		svg({ include: "**/*.svg" }),
		yaml(),
		eslint(),
		tsConfigPaths(),
		react({
			jsxImportSource: "@emotion/react",
			babel: {
				plugins: [["twobj", { tailwindConfig, throwError: true }], "@emotion"],
			},
		}),
		license({
			thirdParty: {
				output: "dist/assets/vendor.LICENSE.txt",
			},
		}),
	],
	esbuild: {
		logOverride: { "this-is-undefined-in-esm": "silent" },
		banner: "/*! licenses: /assets/vendor.LICENSE.txt */",
		legalComments: "none",
	},
})
