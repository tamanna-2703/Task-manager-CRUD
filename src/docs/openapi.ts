import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { envConfig } from '@/config/env'
import { STAGES } from '@/config/stages'
import { Scalar } from '@scalar/hono-api-reference'

export function createOpenAPIAppDocs(app: OpenAPIHono) {
    if (envConfig.STAGE !== STAGES.Prod) {
        app.doc('/doc', {
            openapi: '3.0.0',
            info: {
                title: 'Task Manager API',
                version: '1.0.0',
                description: 'API documentation',
            },
            externalDocs: {
                description: 'TASK Manager API reference',
                url: '/reference',
            },
        })
        app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        });

        /* API Docs */
        app.get('/swagger', swaggerUI({ url: '/doc' }));
        app.get('/reference', Scalar({ url: '/doc', theme: 'deepSpace', pageTitle: 'Task Manager API Reference', showDeveloperTools: "never" }))
    }

    return app
}
