import express from "express";
import { Request, Response } from "express";
import userRouter from "./user";
import todosRouter from "./todos";
import aiRouter from "./ai";

const router = express.Router();

router.use("/user", userRouter);
router.use("/todos", todosRouter);
router.use("/ai", aiRouter);

export default router;
