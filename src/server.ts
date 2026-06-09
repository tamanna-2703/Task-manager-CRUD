import {serve} from '@hono/node-server'
import { createApp } from './app'
import { createOpenAPIAppDocs } from './docs/openapi'
import { envConfig} from '@/config/env'
import logger from './config/logger'
import { registerRoutes } from './routes'

//create app
const app = createApp()

//attach openAPI docs to the app
createOpenAPIAppDocs(app)

//registered routes
registerRoutes(app)


serve({
  fetch:app.fetch,
  port: envConfig.APP_PORT,
},
()=>{
  logger.info(
    {
      port: envConfig.APP_PORT, stage: envConfig.STAGE
    },'🚀 Server started successfully'
  )
}
)
