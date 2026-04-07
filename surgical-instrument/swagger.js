const swaggerDefinition = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Surgical Instrument App API",
      description: "",
      version: "1.0.0",
      contact: {
        email: "info@surgical.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        APIKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
        APIKeyAuth: [],
      },
    ],
  },

  apis: [
    "./src/controllers/auth/interaction/*.js",
    // "./src/controllers/auth/customer/*.js",
    "./src/controllers/auth/forgetPassword/*.js",
    "./src/controllers/v1/admin/instrumentCategory/*.js",
    "./src/controllers/v1/admin/manufacturer/*.js",
    "./src/controllers/v1/admin/product/*.js",
    "./src/controllers/auth/admin/interaction/*.js",
    "./src/routes/auth/admin/*.js",
    "./src/controllers/v1/order/*.js",
    "./src/controllers/v1/instrumentCategory/*.js",
    "./src/controllers/v1/manufacturer/*.js",
    "./src/controllers/v1/product/*.js",
    "./src/controllers/v1/review/*.js",
    "./src/controllers/v1/admin/review/*.js",
    "./src/controllers/v1/admin/profile/*.js",
    "./src/controllers/v1/profile/*.js",
    "./src/controllers/v1/admin/newsEvent/*.js",
    "./src/controllers/v1/admin/order/*.js",
    "./src/controllers/v1/admin/bundle/*.js",
    "./src/controllers/v1/bundle/*.js",
   ],
};

module.exports = {
    swaggerDefinition
}
