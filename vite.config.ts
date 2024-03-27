import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite'

// === Vite config ===

export default defineConfig({
	build: {
		target: 'node20',
	},
	server: {
		port: 3000,
	},
	preview: {
		port: 3000,
	},
	plugins: [
		sveltekit(),
		purgeCss(),
		SvelteKitPWA({
			disable: false,
			devOptions: {
				enabled: true,
			},
			registerType: 'autoUpdate',
			manifest: {
				display: 'standalone',
				name: 'Soundpaddon',
				id: 'com.soundpaddon',
				theme_color: '#000000',
				icons: [{
					src: '/icon.png',
					purpose: 'any',
					sizes: '192x192',
				}]
			}
		}),
		Icons({
			compiler: 'svelte',
		}),
	].concat(process.env.NODE_ENV === 'production' ? [] : [(await import('./src/server/socket')).devSocketSetup()]),
});
