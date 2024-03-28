import { io } from "socket.io-client";
import Soundpad from "soundpad.js/web";
import { serverHost } from "../stores/settings";
import { get, writable, type Writable } from "svelte/store";

const soundpadClient = new Soundpad();

const server = get(serverHost);

const socket = io(`ws://${server.ip}:${server.port}`, {
  secure: false,
  transports: ["websocket"],
});

soundpadClient.connect((query: string) => {
  console.log(query);
  return fetch(`http://${server.ip}:${server.port}/api/soundpad/`, { method: "POST", body: query })
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

export {
  soundpadClient,
  socket,
}

/**
 * 
 * @param ip Checks if the host is reachable
 * @param timeout 
 */
export function testHostIp(ip: string, timeout: number = 1000): Promise<boolean> {
  const endpoint = `http://${ip}:${get(serverHost).port}/api/data`
  return new Promise((resolve) => {
    fetch(endpoint)
      .then(() => resolve(true))
      .catch(() => resolve(false));
    setTimeout(() => resolve(false), timeout);
  });
}
