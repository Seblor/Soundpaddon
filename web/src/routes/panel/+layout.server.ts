import { redirect } from "@sveltejs/kit"
import isMobile from 'is-mobile'

export const prerender = true
export const ssr = false

if (isMobile()) {
  redirect(301, '/panel/mobile')
}