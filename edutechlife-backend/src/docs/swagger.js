const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Edutechlife API',
      version: '1.0.0',
      description: 'API REST para la plataforma Edutechlife - Educación e Inteligencia Artificial',
      contact: {
        name: 'Edutechlife',
        url: 'https://edutechlife.co',
      },
    },
    servers: [
      { url: 'https://edutechlife-api.vercel.app', description: 'Production' },
      { url: 'https://edutechlife-backend.onrender.com', description: 'Render' },
      { url: 'http://localhost:3001', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Clerk JWT token',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/docs/*.yaml'],
}

module.exports = swaggerJsdoc(options)
