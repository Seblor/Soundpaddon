import registerDataRoutes from './data'
import registerSoundpadRoutes from './soundpad'
import importYoutubeRoutes from './import/youtube'
import { type Application } from 'express'
import { App } from 'electron/main'

export const registerRoutes = (app: Application, electronApp: App) => {
  registerDataRoutes(app, electronApp)
  registerSoundpadRoutes(app, electronApp)
  importYoutubeRoutes(app, electronApp)
}
