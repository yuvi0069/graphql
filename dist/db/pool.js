"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DATABASE || "rent-payment",
    password: process.env.DB_PASSWORD || "Lewandowski@09",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});
//# sourceMappingURL=pool.js.map