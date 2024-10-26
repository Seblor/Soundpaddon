import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig, type UserConfig } from 'vite';
import pluginSsl from '@vitejs/plugin-basic-ssl'
import Icons from 'unplugin-icons/vite'
import fetch from 'node-fetch'
import fs from 'fs'

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

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
		proxy: {}
	},
	preview: {
		port: 8081,
	},
	plugins: [
		sveltekit(),
		purgeCss(),
		// pluginSsl({
		// 	domains: ['local-ip.sh:8080'],
		// 	certDir: 'ssl',
		// 	name: 'local-ip.sh',
		// }),
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
					src: '/logo_192.png',
					purpose: 'any',
					sizes: '192x192',
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

if (enableHttps && config.server) {
	await Promise.all([
		downloadFile(keyUrl, 'ssl/server.key'),
		downloadFile(certUrl, 'ssl/server.pem'),
	])
	console.log('downloaded ssl files');
	config.server.https = {
		key: 'ssl/server.pem',
		cert: 'ssl/server.key',
	}
}


export default defineConfig(config)
