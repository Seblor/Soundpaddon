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
