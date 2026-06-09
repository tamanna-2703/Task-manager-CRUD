import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import  * as TasksController from './tasks.controller'
import { 
  createTaskRequestSchema, 
  TaskResponseSchema ,
  TaskListResponseSchema,
  GetTaskByIdSchema,
} from './tasks.types'
import {z} from '@hono/zod-openapi'

const taskRoutes = new OpenAPIHono()

// POST /api/tasks - Create new task
taskRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags: ['Tasks'],
    summary: 'Create a new task',
    request: {
      body: {
        content: {
          'application/json': {
            schema: createTaskRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Task created successfully',
        content: {
          'application/json': {
            schema: TaskResponseSchema,
          },
        },
      },
      409: {
        description: 'Task with title already exists',
      },
    },
  }),
  TasksController.createTaskController
)


taskRoutes.openapi(
  createRoute({
    method:'get',
    path: '/',
    tags:['Tasks'],
    description:'retrieve all taskss',
    responses: {
      200: {
        description: 'Tasks retrieved successfully',
        content: {
          'application/json': {
            schema: TaskListResponseSchema,
          },
        },
      },
    },
  }),
  TasksController.getAllTasksController
)

taskRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Tasks'],
    summary: 'Get task by ID',
    request: {
      params: GetTaskByIdSchema,  // ✅ z.object({ id: uuid })
    },
    responses: {
      200: {
        description: 'Task found',
        content: {
          'application/json': {
            schema: TaskResponseSchema,
          },
        },
      },
      404: {
        description: 'Task not found',
      },
    },
  }),
  TasksController.getTaskByIdController
)

//  Update task
taskRoutes.openapi(
  createRoute({
    method: 'put',
    path: '/{id}',
    tags: ['Tasks'],
    summary: 'Update task by ID',
    request: {
      params: z.object({
        id: z.string(),  // ULID format (same as your GET)
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              title: z.string().min(1).max(255).optional(),
              description: z.string().optional(),
              status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
            }).refine((data) => Object.keys(data).length > 0, {
              message: 'At least one field required'
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Task updated successfully',
        content: {
          'application/json': {
            schema: TaskResponseSchema,  // ✅ Reuse your existing schema!
          },
        },
      },
      404: {
        description: 'Task not found',
      },
    },
  }),
  TasksController.updateTaskController
)


//Delete task
taskRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Tasks'],
    summary: 'Delete task by ID',
    request: {
      params: z.object({
        id: z.string(),  // ULID format
      }),
    },
    responses: {
      200: {
        description: 'Task deleted successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
              deleted: TaskResponseSchema.pick({ id: true, title: true }),
            }),
          },
        },
      },
      404: {
        description: 'Task not found',
      },
    },
  }),
  TasksController.deleteTaskController
)

export default taskRoutes

