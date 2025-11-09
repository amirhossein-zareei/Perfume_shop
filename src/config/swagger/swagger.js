const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Perfume Shop API",
      description:
        "Welcome to the Perfume Shop API documentation. This is a complete backend solution for a specialized fragrance e-commerce platform, built with Node.js, Express, Redis, and MongoDB. Key features include a sophisticated product management system that supports multiple variants per product (e.g., 100ml bottle, 10ml decant), each with independent pricing and stock control. The system also offers secure JWT-based authentication, a persistent shopping cart, a multi-step checkout process with integrated payment gateways, and full order management for both users and administrators. This API is designed to be scalable, secure, and efficient.",
      version: "1.0.0",
    },

    tags: [
      { name: "🔐 Auth", description: "Authentication and authorization" },

      { name: "👤 Users", description: "User profile management" },

      { name: "🛍️ Products", description: "Browse products" },

      { name: "📂 Categories", description: "Browse product categories" },

      { name: "🏷️ Brands", description: "Browse perfume brands" },

      { name: "🛒 Cart", description: "Shopping cart operations" },

      { name: "🏠 Address", description: "Address management endpoints" },

      { name: "💳 Checkout", description: "Checkout and payment" },

      { name: "📦 Orders", description: "User order history" },

      { name: "⚙️👥 Admin - Users", description: "Manage users (Admin only)" },

      {
        name: "⚙️🛍️ Admin - Products",
        description: "Manage products (Admin only)",
      },

      {
        name: "⚙️📦 Admin - Orders",
        description: "Manage orders (Admin only)",
      },

      {
        name: "⚙️🏷️ Admin - Brands",
        description: "Manage brands (Admin only)",
      },

      {
        name: "⚙️📂 Admin - Categories",
        description: "Manage categories (Admin only)",
      },

      {
        name: "⚙️💬 Admin - Comments",
        description: "Manage user comments (Admin only)",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/modules/v1/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const customCss = fs.readFileSync(
  path.join(__dirname, "swagger-theme.css"),
  "utf8"
);

function setupSwagger(app) {
  const swaggerOptions = {
    customCss: customCss,
    customSiteTitle: "Perfume Shop API Docs",
    swaggerOptions: {
      docExpansion: "none",
    },
  };

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerOptions)
  );
}

module.exports = setupSwagger;
