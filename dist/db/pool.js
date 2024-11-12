"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.DB_USER);
console.log(process.env.DB_HOST);
console.log(process.env.DB_DATABASE);
console.log(process.env.DB_PASSWORD);
// export const pool = new Pool({
//   user: "rentpayment_user" ,
//   host: "dpg-cspgsolumphs73d1ql4g-a.oregon-postgres.render.com",
//   database: "rentpayment",
//   password: "k2bug8u6QjrxunmoBnSvB7I4buSG0d8M",
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
// });
exports.pool = new pg_1.Pool({
    connectionString: "postgresql://rentpayment_user:k2bug8u6QjrxunmoBnSvB7I4buSG0d8M@dpg-cspgsolumphs73d1ql4g-a.oregon-postgres.render.com/rentpayment",
    ssl: {
        rejectUnauthorized: false, // Necessary if using a self-signed certificate on the database server
    },
});
const testDbConnection = async () => {
    try {
        // This will attempt a simple query to check the connection
        const client = await exports.pool.connect();
        await client.query("SELECT NOW()"); // Simple query to test connection
        console.log("Database connection successful");
        client.release();
    }
    catch (error) {
        console.error("Database connection failed:", error);
    }
};
// Run the test
testDbConnection();
//# sourceMappingURL=pool.js.map