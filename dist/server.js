"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const auth_1 = __importDefault(require("./routes/auth"));
const data_source_1 = require("./data-source");
const swagger_1 = require("./swagger");
async function main() {
    const app = (0, express_1.default)();
    await data_source_1.AppDataSource.initialize();
    app.use(express_1.default.json());
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (${req.ip})`);
        next();
    });
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerDocument));
    app.use("/api-json", (req, res) => {
        res.status(200).json(swagger_1.swaggerDocument);
    });
    app.use("/tasks", tasks_1.default);
    app.use("/auth", auth_1.default);
    app.get("/", (req, res) => {
        res.status(200).json({
            message: "API is running",
            docs: "/api-docs",
        });
    });
    app.use((error, _req, res, _next) => {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    });
    app.listen(3000, '0.0.0.0', () => {
        console.log("server is listening on port 3000");
        console.log("swagger docs are available at http://localhost:3000/api-docs");
    });
}
console.clear();
main().catch((error) => {
    console.error("failed to start server", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map