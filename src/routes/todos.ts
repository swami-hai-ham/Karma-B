import express from "express";
import { Request, Response } from "express";
import { authMiddleware } from "./middleware/authmiddleware";
const todosRouter = express.Router();
import { PrismaClient } from "@prisma/client";
import { generateMessage } from "./../AIMessages";
const prisma = new PrismaClient();

todosRouter.post(
  "/todo",
  authMiddleware,
  async (req: Request, res: Response) => {
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
    } catch (e) {
      res.status(400).json({
        msg: "Something in the way!",
        error: e,
      });
    }
  }
);

todosRouter.post(
  "/planned",
  authMiddleware,
  async (req: Request, res: Response) => {
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

      const titles: string[] = todolist.map(todo => todo.title)

      const responseMsg = await generateMessage(
        aiName?.aiName ?? "--(No character)", // Use nullish coalescing operator to provide a default value
        titles.toString(),
        "Todo list planned for today",
        user?.firstName ?? "User" // Use nullish coalescing operator to provide a default value
      );

      res.status(200).json({
        responseMsg,
      });
    } catch (e) {
      res.status(400).json({
        msg: "Something in the way!",
        error: e,
      });
    }
  }
);

todosRouter.post(
  "/tododone",
  authMiddleware,
  async (req: Request, res: Response) => {
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

      const responseMsg = await generateMessage(
        aiName?.aiName ?? "--(No character)",
        todo.title,
        "Todo Done",
        user.firstName ?? "User"
      );

      res.status(200).json({
        responseMsg,
      });
    } catch (e) {
      console.error("Error in /tododone route:", e);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

todosRouter.post(
  "/reload",
  authMiddleware,
  async (req: Request, res: Response) => {
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

      const responseMsg = await generateMessage(
        aiName?.aiName ?? "--(No character)", // Use nullish coalescing operator to provide a default value
        "",
        "User entered the app",
        user?.firstName ?? "User" // Use nullish coalescing operator to provide a default value
      );

      res.status(200).json({
        responseMsg,
      });
    } catch (e) {
      res.status(400).json({
        msg: "Something in the way!",
        error: e,
      });
    }
  }
);

export default todosRouter;
