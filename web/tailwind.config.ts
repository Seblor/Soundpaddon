import { join } from 'path'
import type { Config } from 'tailwindcss'
import { skeleton } from '@skeletonlabs/tw-plugin'
import { customTheme, customThemeDark } from './theme'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {},
	},
	plugins: [
		skeleton({
			themes: {
				custom: [
					customTheme,
					customThemeDark,
				],
				preset: [
					{
						name: 'wintry',
						enhancements: true,
					},
					{
						name: 'skeleton',
						enhancements: true,
					},
					{
						name: 'modern',
						enhancements: true,
					},
					{
						name: 'crimson',
						enhancements: true,
					},
				],
			},
		}),
	],
} satisfies Config;
