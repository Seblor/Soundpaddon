import registerDataRoutes from './data'
import registerSoundpadRoutes from './soundpad'
import refisterProxyRoutes from './proxy'
import importYoutubeRoutes from './import/youtube'
import importUrlRoutes from './import/url'
import { type Application } from 'express'
import { App } from 'electron/main'

export const registerRoutes = (app: Application, electronApp: App) => {
  registerDataRoutes(app, electronApp)
  registerSoundpadRoutes(app, electronApp)
  refisterProxyRoutes(app, electronApp)
  importYoutubeRoutes(app, electronApp)
  importUrlRoutes(app, electronApp)
}
