import type { RequestHandler } from '@sveltejs/kit';
import Soundpad from 'soundpad.js'
import { isBuild } from '../../../utils/misc';

const soundpadClient = new Soundpad({
  autoReconnect: true,
  startSoundpadOnConnect: true,
})

if (isBuild() === false) {
  soundpadClient.connect()
}

export const POST: RequestHandler = async function ({ request, cookies }) {
  const data = await request.text();

  return new Response(await soundpadClient.sendQuery(data))
}

// Preflight request handler for CORS
export const OPTIONS: RequestHandler = async function () {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '600',
    }
  })
}
