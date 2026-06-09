import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Status = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    IN_PROGRESS: "IN_PROGRESS"
} as const;
export type Status = (typeof Status)[keyof typeof Status];
export type Task = {
    id: string;
    title: string;
    description: string | null;
    status: Generated<Status>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type DB = {
    Tasks: Task;
};
