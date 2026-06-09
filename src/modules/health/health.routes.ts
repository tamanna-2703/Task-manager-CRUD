import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import * as HealthController from "@/modules/health/health.controller";
import { HealthResponseSchema, HealthErrorResponseSchema } from "@/modules/health/health.types";

const healthRouter = new OpenAPIHono();

// GET /health - Health check endpoint
healthRouter.openapi(
    createRoute({
        method: "get",
        path: "/health",
        tags: ["Health"],
        description: 'Check the health status of the API server. Returns server status, database connectivity, and system information. Useful for monitoring and load balancer health checks.',
        responses: {
            200: {
                description: "Health check successful",
                content: {
                    "application/json": {
                        schema: HealthResponseSchema,
                    },
                },
            },
            500: {
                description: "Server error",
                content: {
                    "application/json": {
                        schema: HealthErrorResponseSchema,
                    },
                },
            },
        },
    }),
    HealthController.getHealthController
);

export default healthRouter;
