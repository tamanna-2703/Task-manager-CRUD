import {z} from '@hono/zod-openapi'
import { Status } from '@/db/types'

export const createTaskRequestSchema = z.object({
  title: z.string().min(1, 'title required'),
  description: z.string().optional(),
  status: z.enum(Status)
})

export const TaskResponseSchema= createTaskRequestSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const TaskListResponseSchema = z.object({
  tasks: z.array(TaskResponseSchema),
  count: z.number(),
  hasMore: z.boolean(),
})

export const GetTaskByIdSchema = z.object({
  id: z.string().uuid(),
})

export const UpdateTaskRequestSchema = z.object({
  id: z.string(),  
})

export const UpdateTaskResponseSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(Status).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
})

export const DeleteTaskRequestSchema = z.object({
  id: z.string(), 
})
export const DeleteTaskResponseSchema = z.object({
  success: z.boolean().default(true),
  message: z.string(),
  deleted: TaskResponseSchema.optional(),  
})


export type createTaskRequest = z.infer<typeof createTaskRequestSchema>
export type TaskResponse = z.infer<typeof TaskResponseSchema>
export type TaskListResponse = z.infer<typeof TaskListResponseSchema>
export type GetTaskById = z.infer<typeof GetTaskByIdSchema>
export type updateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>
export type updatetaskResponse = z.infer<typeof 
UpdateTaskResponseSchema>
export type DeleteRequest = z.infer<typeof DeleteTaskRequestSchema>
export type DeleteTaskResponse = z.infer<typeof DeleteTaskResponseSchema>