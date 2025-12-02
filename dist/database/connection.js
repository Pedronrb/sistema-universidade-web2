"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER || "admin",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "universidade",
    password: process.env.DB_PASSWORD || "admin",
    port: Number(process.env.DB_PORT || 5432),
});
const testConnection = async () => {
    try {
        const client = await exports.pool.connect();
        console.log("Conexão com o banco realizada com sucesso!");
        client.release();
    }
    catch (error) {
        console.error("Erro ao conectar ao banco:", error);
    }
};
exports.testConnection = testConnection;
//# sourceMappingURL=connection.js.map