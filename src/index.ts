import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'
import { cors } from '@elysiajs/cors'
import { usersRoutes } from './api/users'
import { postsRoutes } from './api/posts'
import { testRoutes } from './api/test'

const app = new Elysia()
  .use(openapi({
  exclude: {
    paths: [
      '/__hmr',
      '/bunnyx-api/*',
      '/compiled/*',
      '/styles/*',
      '/images/*',
      '/node_modules/*',
      '/error-overlay.js',
      '/bertui-animate.css',
      '/*'
    ]
  },
  documentation: {
    info: {
      title: 'BunnyX Test API',
      version: '0.0.1',
      description: 'Live API docs for the Bunnyx test project'
    }
  }
}))  // ← adds /reference route with Scalar UI
  .use(cors())
  .use(usersRoutes)
  .use(postsRoutes)
  .use(testRoutes)

export type App = typeof app
export default app