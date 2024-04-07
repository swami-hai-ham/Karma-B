"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiInp = exports.TodoInp = exports.SigninInput = exports.UserSign = void 0;
const zod_1 = require("zod");
exports.UserSign = zod_1.z.object({
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    password: zod_1.z.string().min(6),
});
exports.SigninInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.TodoInp = zod_1.z.string().max(30);
exports.AiInp = zod_1.z.object({
    aiName: zod_1.z.string(),
    imageUrl: zod_1.z.string(),
});
