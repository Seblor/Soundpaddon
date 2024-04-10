import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig, type UserConfig } from 'vite';
import Icons from 'unplugin-icons/vite'
import fetch from 'node-fetch'
import fs from 'fs'

const enableHttps = !process.env.VERCEL_ENV;
// const keyUrl = 'http://local-ip.co/cert/server.pem'
// const certUrl = 'http://local-ip.co/cert/server.key'
const keyUrl = 'https://local-ip.sh/server.pem'
const certUrl = 'https://local-ip.sh/server.key'

// === Vite config ===

const config: UserConfig = {
	build: {
		target: 'node20',
	},
	server: {
		port: 8080,
	},
	preview: {
		port: 8080,
	},
	plugins: [
		sveltekit(),
		purgeCss(),
		SvelteKitPWA({
			disable: false,
			devOptions: {
				enabled: true,
			},
			base: '/',
			registerType: 'autoUpdate',
			manifest: {
				start_url: '/panel',
				display: 'standalone',
				name: 'Soundpaddon',
				id: 'com.soundpaddon',
				theme_color: '#000000',
				icons: [{
					src: '/icon.png',
					purpose: 'any',
					sizes: '144x144',
				}]
			}
		}),
		Icons({
			compiler: 'svelte',
		}),
	].concat(process.env.NODE_ENV === 'production' ? [] : [
		// (await import('./src/server/socket')).devSocketSetup()
	]),
};

function downloadFile(url: string, targetPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fetch(url).then(res => {
			const dest = fs.createWriteStream(targetPath);
			if (res.body === null) {
				reject(new Error('Response body is null'))
				return
			}
			res.body.pipe(dest);
			dest.on('finish', () => {
				dest.close()
				resolve()
			});
		})
	})
}


export default defineConfig(config)
