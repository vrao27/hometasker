const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.1.0", // API documentation format (latest OpenAPI version)
        info: {
            title: "HomeTasker API", // Name of your API
            version: "1.0.0", // API version
            description: "API Documentation for HomeTasker backend", // Short API description
        },
        servers: [
            {
                url: "http://localhost:5000", // API Base URL (change this in production with your public IP)
                description: "Local server",
            },
        ],
    },
    apis: ["./routes/*.js"], // Path where Swagger looks for route documentation
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
