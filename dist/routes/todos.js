"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = require("./middleware/authmiddleware");
const todosRouter = express_1.default.Router();
const client_1 = require("@prisma/client");
const AIMessages_1 = require("./../AIMessages");
const prisma = new client_1.PrismaClient();
todosRouter.post("/todo", authmiddleware_1.authMiddleware, async (req, res) => {
    const body = req.body;
    const userId = res.locals.userId;
    try {
        const todo = await prisma.todoList.create({
            data: {
                userId: userId,
                title: body.title,
            },
        });
        res.status(200).json({
            todo: todo,
        });
    }
    catch (e) {
        res.status(400).json({
            msg: "Something in the way!",
            error: e,
        });
    }
});
todosRouter.post("/planned", authmiddleware_1.authMiddleware, async (req, res) => {
    const userId = res.locals.userId;
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                firstName: true,
            },
        });
        const aiName = await prisma.aIConfig.findFirst({
            where: {
                userId: userId,
            },
            select: {
                aiName: true,
            },
        });
        const todolist = await prisma.todoList.findMany({
            where: {
                userId: userId,
            },
        });
        const titles = todolist.map(todo => todo.title);
        const responseMsg = await (0, AIMessages_1.generateMessage)(aiName?.aiName ?? "--(No character)", // Use nullish coalescing operator to provide a default value
        titles.toString(), "Todo list planned for today", user?.firstName ?? "User" // Use nullish coalescing operator to provide a default value
        );
        res.status(200).json({
            responseMsg,
        });
    }
    catch (e) {
        res.status(400).json({
            msg: "Something in the way!",
            error: e,
        });
    }
});
todosRouter.post("/tododone", authmiddleware_1.authMiddleware, async (req, res) => {
    const body = req.body;
    const userId = res.locals.userId;
    // Validate required properties
    if (!body.todoid) {
        return res.status(400).json({ error: "Missing todoid in request body" });
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                firstName: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const aiName = await prisma.aIConfig.findFirst({
            where: {
                userId: userId,
            },
            select: {
                aiName: true,
            },
        });
        const todo = await prisma.todoList.findFirst({
            where: {
                userId: userId,
                id: body.todoid,
            },
        });
        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        await prisma.todoList.delete({
            where: {
                id: todo.id,
            },
        });
        const todoAll = await prisma.todoList.findMany({
            where: {
                userId: userId
            }
        });
        const condition = todoAll.length == 0;
        const responseMsg = await (0, AIMessages_1.generateMessage)(aiName?.aiName ?? "--(No character)", todo.title, condition ? "Todo Done & Whole Todo list Done" : "Todo done", user.firstName ?? "User");
        res.status(200).json({
            responseMsg,
        });
    }
    catch (e) {
        console.error("Error in /tododone route:", e);
        res.status(500).json({
            error: "Internal server error",
        });
    }
});
todosRouter.post("/reload", authmiddleware_1.authMiddleware, async (req, res) => {
    const userId = res.locals.userId;
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                firstName: true,
            },
        });
        const aiName = await prisma.aIConfig.findFirst({
            where: {
                userId: userId,
            },
            select: {
                aiName: true,
            },
        });
        const responseMsg = await (0, AIMessages_1.generateMessage)(aiName?.aiName ?? "--(No character)", // Use nullish coalescing operator to provide a default value
        "", "User entered the app", user?.firstName ?? "User" // Use nullish coalescing operator to provide a default value
        );
        res.status(200).json({
            responseMsg,
        });
    }
    catch (e) {
        res.status(400).json({
            msg: "Something in the way!",
            error: e,
        });
    }
});
exports.default = todosRouter;
