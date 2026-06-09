import type { Transaction } from 'kysely'
import type { DB } from '@/db/types'
import { sql } from 'kysely'
import { ConflictError, NotFoundError } from '@/shared/errors'

const DEFAULT_STATUS = 'PENDING'

export async function createTask(
  trx: Transaction<DB>,
  title: string,
  description?: string
) {
  // Check if task with same title exists 
  const existingTask = await trx
    .selectFrom('Tasks')
    .select(['id'])
    .where('title', '=', title)
    .executeTakeFirst()

  if (existingTask) {
    throw new ConflictError('Task with this title already exists')
  }

  // 1️⃣ Insert taskss
  const task = await trx
    .insertInto('Tasks')
    .values({
      id: sql`gen_random_uuid()`,
      updatedAt: sql`CURRENT_TIMESTAMP`,
      title,
      description: description || null,
      status: DEFAULT_STATUS,
    })
    .returning(['id', 'title', 'description', 'status'])
    .executeTakeFirstOrThrow()

  return { task }
}

// ✅ GET ALL TASKS (NEW)
export async function getAllTasks(trx: Transaction<DB>) {
  const tasks = await trx
    .selectFrom('Tasks')
    .selectAll()
    .orderBy('createdAt', 'desc')
    .execute()

  // Map the results to convert Dates to Strings and handle nulls
  return tasks.map(task => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    description: task.description ?? undefined, // Changes null to undefined
  }))
}

// ✅ GET TASK BY ID (NEW)
export async function getTaskById(
  trx: Transaction<DB>,
  id: string
) {
  const task = await trx
    .selectFrom('Tasks')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  if (!task) {
    throw new NotFoundError(`Task with id ${id} not found`)
  }

  return task
}

// ✅ UPDATE TASK BY ID
export async function updateTask(
  trx: Transaction<DB>,
  id: string,
  data: { title?: string; description?: string; status?: string }
) {
  // 1. Check task exists
  const existingTask = await trx
    .selectFrom('Tasks')
    .select(['id'])
    .where('id', '=', id)
    .executeTakeFirst()

  if (!existingTask) {
    throw new NotFoundError(`Task with id ${id} not found`)
  }

  // 2. Update task
  const updatedTask = await trx
    .updateTable('Tasks')
    .set({
  ...data,
  status: data.status as 'PENDING' | 'COMPLETED' | 'IN_PROGRESS',
  updatedAt: sql`CURRENT_TIMESTAMP`,
})
    .where('id', '=', id)
    .returning(['id', 'title', 'description', 'status', 'updatedAt', 'createdAt'])
    .executeTakeFirstOrThrow()

  return updatedTask
}
// ✅ DELETE TASK BY ID
export async function deleteTask(
  trx: Transaction<DB>,
  id: string
) {
  // 1. Check task exists
  const existingTask = await trx
    .selectFrom('Tasks')
    .select(['id', 'title'])
    .where('id', '=', id)
    .executeTakeFirst()

  // 2. Delete task
  await trx
    .deleteFrom('Tasks')
    .where('id', '=', id)
    .executeTakeFirst()

  // 3. Return deleted task info
  return {
    success: true,
    message: 'Task deleted successfully',
    deleted: existingTask,
  }
}
