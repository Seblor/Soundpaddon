import type { RequestHandler } from '@sveltejs/kit';
import { networkInterfaces } from 'os'

const nets = networkInterfaces();

export const GET: RequestHandler = async function () {
  const localIPs = Object.values(nets).flat().filter(net => net && net.family === 'IPv4' && !net.address.startsWith('127')).map(net => net?.address)
  return new Response(JSON.stringify({ localIPs }))
}
