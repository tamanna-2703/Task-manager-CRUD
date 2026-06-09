import { z } from "zod";

// Health check response schemas
export const HealthResponseSchema = z.object({
    status: z.string().openapi({ example: "ok" }),
    database: z.string().openapi({ example: "connected" }),
    uptime: z.number().openapi({ example: 1234.56 }),
    timestamp: z.string().datetime().openapi({ example: "2023-01-01T00:00:00.000Z" }),
});

export const HealthErrorResponseSchema = z.object({
    status: z.string().openapi({ example: "error" }),
    database: z.string().openapi({ example: "disconnected" }),
});

// Inferred types
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type HealthErrorResponse = z.infer<typeof HealthErrorResponseSchema>;

