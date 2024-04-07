import express from "express";
const userRouter = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { authMiddleware } from "./middleware/authmiddleware";
import { signupmiddleware } from "./middleware/signupmiddleware";
import { Request, Response } from "express";
import { signinmiddleware } from "./middleware/signinmiddleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { hash, compare } from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

userRouter.post(
  "/signup",
  signupmiddleware,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;

      // Input validation
      // ...

      const existingUser = await prisma.user.findFirst({
        where: {
          email: {
            equals: `${req.body.email}`,
          },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email already taken",
        });
      }

      // Hash the password
      const hashedPassword = await hash(body.password, 10);

      const newUser = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          firstName: body.firstName,
          lastName: body.lastName,
        },
      });

      const userId = newUser.id;

      const token = jwt.sign(
        {
          userId,
        },
        JWT_SECRET
      );

      res.json({
        message: "User created successfully",
        token: token,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return res.status(400).json({
            message: "Email already taken",
          });
        }
      }
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

userRouter.post(
  "/signin",
  signinmiddleware,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Compare the provided password with the hashed password
      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Generate and send the JWT token
      const token = jwt.sign(
        {
          userId: user.id,
        },
        JWT_SECRET
      );

      res.json({
        message: "User signed in successfully",
        token: token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

userRouter.get("/user", async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        aiConfig: true,
        todoLists: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default userRouter;
