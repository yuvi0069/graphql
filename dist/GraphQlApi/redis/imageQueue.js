"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/imageQueue.ts
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("./redis"));
// Define a queue
const imageUploadQueue = new bullmq_1.Queue("imageUpload", {
    connection: redis_1.default,
});
exports.default = imageUploadQueue;
//# sourceMappingURL=imageQueue.js.map