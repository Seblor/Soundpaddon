import { AUTOSTART_ACTIONS } from '$lib/utils/enums';
import { disableAutoStart, enableAutoStart, getAutoStartValue } from '$lib/utils/start-with-windows';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async function ({ request, cookies }) {
  const data = await request.text();

  if (!(data in AUTOSTART_ACTIONS) || process.env.NODE_ENV !== 'production') {
    return new Response('Invalid action', { status: 400 });
  }

  switch (data as AUTOSTART_ACTIONS) {
    case AUTOSTART_ACTIONS.ENABLE:
      enableAutoStart('Soundpad', 'C:\\Program Files (x86)\\Soundpad\\Soundpad.exe');
      break;
    case AUTOSTART_ACTIONS.DISABLE:
      disableAutoStart('Soundpad');
      break;
    case AUTOSTART_ACTIONS.GET:
      return new Response(String(await getAutoStartValue('Soundpad')));
  }

  return new Response('OK')
}
