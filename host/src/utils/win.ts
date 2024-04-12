// Taken from https://github.com/hetrodoo/node-hide-console-window, reimported because ".node" file is bundled and needs to be exported before import
import nodeSea from 'node:sea'
import path from 'node:path'

export async function hideWindow() {
  // @ts-ignore
  const NHCW = await (nodeSea.isSea() ? import(path.join(__dirname, './traybin/node-hide-console-window.node')) : import('node-hide-console-window'))
  NHCW.hideConsole()
}