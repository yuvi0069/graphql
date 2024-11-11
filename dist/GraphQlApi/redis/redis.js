"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
// src/redisClient.ts
const ioredis_1 = require("ioredis");
exports.redis = new ioredis_1.Redis({
    host: 'localhost', // Replace with your Redis host
    port: 6379, // Replace with your Redis port
    maxRetriesPerRequest: null,
});
exports.redis.on("ready", () => {
    console.log("Redis is connected and ready to use!");
});
exports.default = exports.redis;
//# sourceMappingURL=redis.js.map