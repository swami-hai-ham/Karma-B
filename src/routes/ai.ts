import express from "express";
import { Request, Response } from "express";
import { authMiddleware } from "./middleware/authmiddleware";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const aiRouter = express.Router();

aiRouter.post(
  "/aiconfig",
  authMiddleware,
  async (req: Request, res: Response) => {
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
    } catch (e) {
      res.status(400).json({
        msg: "Something in the way!",
        error: e,
      });
    }
  }
);

export default aiRouter;
