"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageQueue_1 = __importDefault(require("./imageQueue"));
const trackJob = async (jobId) => {
    const job = await imageQueue_1.default.getJob(jobId);
    if (!job) {
        throw new Error("Job not found");
    }
    // Check if the job is finished by accessing the finishedOn property
    const finishedAt = job.finishedOn;
    if (!finishedAt) {
        console.log("Job is not finished yet.");
        return;
    }
    const result = await job.returnvalue; // Assuming returnvalue is where the result is stored
    console.log(`Image uploaded successfully, URL: ${result}`);
};
//# sourceMappingURL=imagetracker.js.map