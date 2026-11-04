import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OTD AI Fashion Companion & Atelier REST API',
      version: '1.0.0',
      description:
        'Production REST API providing digital closet indexing, AI chromatic synthesis, real-time weather integration, venue dress codes, and virtual try-on drape simulation.',
      contact: {
        name: 'OTD Engineering',
        url: 'https://github.com/OTD',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide your JWT bearer token in the Authorization header.',
        },
      },
      schemas: {
        StandardSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string', example: 'Operation completed successfully' },
          },
        },
        StandardErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'number', example: 400 },
                message: { type: 'string', example: 'Validation error message' },
              },
            },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check probe',
          tags: ['Health'],
          responses: {
            200: {
              description: 'Service is operational',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      uptime: { type: 'number', example: 120.5 },
                      timestamp: { type: 'string', example: '2026-11-02T16:00:00.000Z' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          summary: 'Authenticate curator and obtain JWT token',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'curator@otd.luxury' },
                    password: { type: 'string', example: 'SuperSecurePass123!' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            400: { description: 'Invalid credentials or payload' },
          },
        },
      },
      '/api/v1/wardrobe': {
        get: {
          summary: 'List user digital wardrobe items',
          tags: ['Wardrobe'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'category',
              in: 'query',
              schema: { type: 'string', enum: ['tops', 'bottoms', 'outerwear', 'footwear', 'accessories'] },
              description: 'Filter items by garment category',
            },
          ],
          responses: {
            200: { description: 'List of wardrobe items' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/v1/outfits/generate': {
        post: {
          summary: 'Generate tailored outfit from verified closet inventory',
          tags: ['Outfits'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['occasion'],
                  properties: {
                    occasion: { type: 'string', example: 'Dinner at Rooftop Lounge' },
                    venue: { type: 'string', example: "L'Amore Fine Dining" },
                    vibe: { type: 'string', example: 'Refined Elegance' },
                    weather: { type: 'string', example: '22°C Clear Night' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Synthesized outfit recommendation with chromatic harmony score' },
            401: { description: 'Unauthorized' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
