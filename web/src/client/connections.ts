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

await soundpadClient.connectionAwaiter;

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
  // return `${ip.replace(/\./g, '-')}.my.local-ip.co`;
  return `${ip.replace(/\./g, '-')}.local-ip.sh`;
}

/**
 * 
 * @param ip Checks if the host is reachable
 * @param timeout 
 */
export function testHostIp(ip: string, timeout: number = 1000): Promise<'https' | 'http' | 'offline'> {
  let endpoint = `https://${ipToSSLDomain(ip)}:${get(serverHost).port}/api/data`
  if (!isHttps()) {
    endpoint = `http://${ip}:${get(serverHost).port + 1}/api/data`;
  }
  return new Promise((resolve) => {
    fetch(endpoint)
      .then(() => resolve('https'))
      .catch((e) => {
        resolve('http')
      });
    setTimeout(() => resolve('offline'), timeout);
  });
}
