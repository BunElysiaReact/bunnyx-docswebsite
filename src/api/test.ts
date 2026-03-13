import { Elysia, t } from 'elysia'

export const testRoutes = new Elysia({ prefix: '/api/test' })
  .get('/', () => ({
    message: 'API is working!',
    timestamp: new Date().toISOString()
  }))
  
  .get('/user/:id', ({ params }) => ({
    id: params.id,
    name: `User ${params.id}`,
    email: `user${params.id}@example.com`
  }), {
    params: t.Object({
      id: t.Numeric()
    })
  })
  
  .post('/data', ({ body }) => ({
    received: body,
    processed: true
  }), {
    body: t.Object({
      name: t.String(),
      age: t.Number()
    })
  })