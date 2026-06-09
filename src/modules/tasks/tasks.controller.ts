import type { Context } from 'hono'
import { db } from '@/db/kysely'
import { createTask } from './tasks.service'
import { getAllTasks, getTaskById } from './tasks.service'
import { updateTask, deleteTask } from './tasks.service'

export const createTaskController = async (c: Context) => {
  const { title, description } = await c.req.json()

  const result = await db.transaction().execute(async (trx) => {
    return createTask(trx, title, description)
  })

  return c.json(result)
}

// ✅ GET ALL TASKS 
export const getAllTasksController = async (c: Context) => {
  const rawTasks = await db.transaction().execute(async (trx) => {
    return getAllTasks(trx)
  })

  // ✅ Transform the data to match your API schema
  const tasks = rawTasks.map((task) => ({
  ...task,
  // This handles both Date objects and Strings safely
  createdAt: new Date(task.createdAt).toISOString(),
  updatedAt: new Date(task.updatedAt).toISOString(),
  description: task.description ?? undefined,
}))

  return c.json(
    tasks
  )
}


// ✅ GET TASK BY ID
export const getTaskByIdController = async (c: Context) => {
  const  id  = c.req.param('id')

  // console.log(id)
  
  const task = await db.transaction().execute(async (trx) => {
    return getTaskById(trx, id)
  })

  return c.json({
      ...task,
      createdAt: new Date(task.createdAt).toISOString(),
      updatedAt: new Date(task.updatedAt).toISOString(),
      description: task.description ?? undefined
    })
}


export const updateTaskController = async (c: Context) => {
  const id = c.req.param('id')
  const updateData = await c.req.json()

  const task = await db.transaction().execute(async (trx) => {
    return updateTask(trx, id, updateData)
  })

  return c.json(task, 200)
}
// ✅ DELETE /api/tasks/:id - Delete task
export const deleteTaskController = async (c: Context) => {
  const id = c.req.param('id')

  const result = await db.transaction().execute(async (trx) => {
    return deleteTask(trx, id)
  })

  return c.json(result, 200)
}
