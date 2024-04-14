import { get } from "svelte/store";
import { ipToSSLDomain } from "../../client/connections";
import { serverHost } from "../../stores/settings";

export function getEndpointUrl() {
  const server = get(serverHost)
  return `https://${ipToSSLDomain(server.ip)}:${server.port}/api`;
}