// import adapter from '@sveltejs/adapter-auto';
// import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

let adapter = adapterStatic({
	fallback: 'index.html'
});

if (process.env.VERCEL_ENV) {
	adapter = adapterVercel();
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],
	optimizeDeps: { exclude: ['@skeletonlabs/skeleton', 'driver.js/dist/driver.css'] },

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter,
		csrf: {
			checkOrigin: false,
		},
		version: {
			name: pkg.version
		}
	}
};

export default config;
