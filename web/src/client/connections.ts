import { io } from "socket.io-client";
import Soundpad from "soundpad.js/lib/web";
import { serverHost } from "../stores/settings";
import { get, writable, type Writable } from "svelte/store";
import { checkIsDemo, isHttps } from "$lib/utils/misc";

const soundpadClient = new Soundpad();

const server = get(serverHost);

const serverHostname = isHttps() ? ipToSSLDomain(server.ip) : location.hostname;

const socket = io(`${isHttps() ? 'wss' : 'ws'}://${serverHostname}:${server.port}`, {
  autoConnect: false,
  transports: ["websocket"],
});

soundpadClient.connect((query: string) => {
  if (checkIsDemo()) {
    return Promise.resolve('');
  }
  return fetch(`${isHttps() ? 'https' : 'http'}://${serverHostname}:${server.port}/api/soundpad`, { method: "POST", body: query })
    .then((data) => data.text())
    .then((data) => {
      return data;
    });
});

export const isConnected: Writable<boolean> = writable(false);

socket.on("connect", () => {
  isConnected.set(true);
});

if (checkIsDemo()) {
  isConnected.set(true);
};

export {
  soundpadClient,
  socket,
}

export function ipToSSLDomain(ip: string): string {
  return `${ip.replace(/\./g, '-')}.local.soundpaddon.app`;
}

/**
 * 
 * @param ip Checks if the host is reachable
 * @param timeout 
 */
export async function testHostIp(ip: string, timeout: number = 1000): Promise<'https' | 'http' | 'offline'> {
  return new Promise(async resolve => {
    const [https, http] = await Promise.allSettled([
      fetchWithTimeout(`https://${ipToSSLDomain(ip)}:${get(serverHost).port}/api/data`, timeout),
      fetchWithTimeout(`http://${ip}:${get(serverHost).port + 1}/api/data`, timeout),
    ]).catch(() => {
      resolve('offline');
      return Promise.reject();
    })
    if (https.status === 'fulfilled' && https.value) {
      resolve('https');
    }
    if (http.status === 'rejected') {
      resolve('http');
    }
    resolve('offline');
  })
}

function fetchWithTimeout(url: string, timeout: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => {
      controller.abort();
      reject(new Error('timeout'));
    }, timeout);
    fetch(url, { signal })
      .then(resolve)
      .catch(reject);
  });
}
