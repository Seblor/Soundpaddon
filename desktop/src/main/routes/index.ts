import registerDataRoutes from './data'
import registerSoundpadRoutes from './soundpad'
import { type Application } from 'express'

export const registerRoutes = (app: Application) => {
  registerDataRoutes(app)
  registerSoundpadRoutes(app)
}
