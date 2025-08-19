"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const vendingRoutes_1 = __importDefault(require("./routes/vendingRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api', vendingRoutes_1.default);
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Vending Machine API',
            version: '1.0.0',
            description: 'API documentation for the Vending Machine backend',
        },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get('/api', (req, res) => {
    res.send('Vending Machine API is running');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
exports.default = app;
