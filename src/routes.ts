import { OpenAPIHono } from '@hono/zod-openapi'    


//route import
import healthRoutes from '@/modules/health/health.routes'
import taskRoutes from './modules/tasks/tasks.routes'


export function registerRoutes(app:OpenAPIHono){

  //health
  app.route('/', healthRoutes)

  //task routes
  app.route('/api/tasks', taskRoutes)
}