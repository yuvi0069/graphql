"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcryptPassword = exports.comparePassword = exports.saveImageToFirebase = exports.saveImageToFirebase1 = void 0;
exports.createUserClient = createUserClient;
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../../errors");
const db_1 = require("../models/db");
const firebaseadmin_1 = require("../config/firebaseadmin");
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
// import { Worker, Job } from "bullmq";
// import redis from "../redis/redis";
// export const imageUploadWorker = new Worker("imageUpload", async (job: Job) => {
//   const { userUuid, filename, buffer } = job.data; // Receive the buffer
//   console.log(`Processing image for user ${userUuid}: ${filename}`);
//   const jsonString = JSON.stringify(buffer);
//   const bufferFromObject = Buffer.from(jsonString);
//   // Upload the buffer directly to Firebase
//   console.log(typeof(bufferFromObject))
//   if (!Buffer.isBuffer(bufferFromObject)) {
//     throw new TypeError("Expected buffer to be of type Buffer");
//   }
//   const imageUrl = await saveImageToFirebase1(bufferFromObject, filename); // Update this function to handle buffer
//   console.log(imageUrl);
//   return imageUrl;
// }, {
//   connection: redis,
// });
// // Handle errors
// imageUploadWorker.on("failed", (job, err) => {
//   console.error(`Job ${job.id} failed:`, err);
// });
// export const saveImageLocally = async (stream: NodeJS.ReadableStream, filename: string) => {
//   const uniqueFilename = `${Date.now()}-${filename}`;
//   const filePath = path.join(uploadDir, uniqueFilename);
//   const out = fs.createWriteStream(filePath);
//   return new Promise<any>((resolve, reject) => {
//     stream
//       .pipe(out)
//       .on('finish', () => resolve(`/uploads/${filename}`))
//       .on('error', (error) => reject(`Error saving file: ${error.message}`));
//   });
// };
const saveImageToFirebase1 = async (buffer, filename) => {
    const bucket = firebaseadmin_1.admin.storage().bucket();
    const file = bucket.file(`images/${filename}`);
    // Upload the buffer directly
    await file.save(buffer, {
        metadata: {
            contentType: 'image/jpeg',
        },
    });
    // Get the signed URL for the uploaded file
    const url = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
    });
    return url[0]; // Return the signed URL
};
exports.saveImageToFirebase1 = saveImageToFirebase1;
const saveImageToFirebase = async (stream, filename) => {
    const file = firebaseadmin_1.bucket.file(`images/${filename}`);
    return new Promise((resolve, reject) => {
        const writeStream = file.createWriteStream({
            metadata: {
                contentType: 'image/jpeg'
            }
        });
        stream.pipe(writeStream)
            .on('finish', async () => {
            const url = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 1000 * 60 * 60 * 24 * 365 * 10
            });
            resolve(url[0]);
        })
            .on('error', (error) => {
            reject(error);
        });
    });
};
exports.saveImageToFirebase = saveImageToFirebase;
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt_1.default.compare(password, hashedPassword);
};
exports.comparePassword = comparePassword;
const bcryptPassword = async (password) => {
    if (!password) {
        throw new errors_1.NoParametersError("NO PASSWORD");
    }
    return new Promise((resolve, reject) => {
        bcrypt_1.default.hash(password, 10, (err, hash) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(hash);
            }
        });
    });
};
exports.bcryptPassword = bcryptPassword;
async function createUserClient(data, otp) {
    const encryptPassword = await (0, exports.bcryptPassword)(data.password);
    const roleId = await (0, db_1.getUserRoleIdByName)(data.role);
    const clients = await (0, db_1.insertUser)(data, otp, encryptPassword.toString(), roleId);
    return {
        userId: clients.id,
        userUuid: clients.uuid,
    };
}
//# sourceMappingURL=function.js.map