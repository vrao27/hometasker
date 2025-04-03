const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")


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
                url: "http://192.168.2.31:5000", // API Base URL (change this in production with your public IP)
                description: "Local network server",
            },
        ],
    },
    apis: ["./routes/*.js"], // Path where Swagger looks for route documentation
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
};

module.exports = setupSwagger;
