import type { Context, Handler } from "hono";
import { db } from "@/db/kysely"

export const getHealthController: Handler = async (c: Context) => {
    try {
        await db.selectFrom("Tasks").select("id").limit(1).execute();

        return c.json({
            status: "ok",
            database: "connected",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        });
    } catch {
        return c.json(
            {
                status: "error",
                database: "disconnected",
            },
            500
        );
    }
};

