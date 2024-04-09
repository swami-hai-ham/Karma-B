"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = require("./middleware/authmiddleware");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const aiRouter = express_1.default.Router();
aiRouter.post("/aiconfig", authmiddleware_1.authMiddleware, async (req, res) => {
    const body = req.body;
    const userId = res.locals.userId;
    try {
        const findAI = await prisma.aIConfig.findFirst({
            where: {
                userId: userId,
            },
        });
        if (findAI) {
            const deleteAI = await prisma.aIConfig.delete({
                where: {
                    id: findAI.id,
                },
            });
        }
        const ai = await prisma.aIConfig.create({
            data: {
                userId: userId,
                aiName: body.aiName,
                imageUrl: body.imageUrl,
            },
        });
        res.status(200).json({
            ai,
        });
    }
    catch (e) {
        res.status(400).json({
            msg: "Something in the way!",
            error: e,
        });
    }
});
exports.default = aiRouter;
