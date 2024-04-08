"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authmiddleware_1 = require("./middleware/authmiddleware");
const signupmiddleware_1 = require("./middleware/signupmiddleware");
const signinmiddleware_1 = require("./middleware/signinmiddleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_2 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET_KEY;
userRouter.post("/signup", signupmiddleware_1.signupmiddleware, async (req, res) => {
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
        const hashedPassword = await (0, bcrypt_1.hash)(body.password, 10);
        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                firstName: body.firstName,
                lastName: body.lastName,
            },
        });
        const userId = newUser.id;
        const token = jsonwebtoken_1.default.sign({
            userId,
        }, JWT_SECRET);
        res.json({
            message: "User created successfully",
            token: token,
        });
    }
    catch (error) {
        if (error instanceof client_2.Prisma.PrismaClientKnownRequestError) {
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
});
userRouter.post("/signin", signinmiddleware_1.signinmiddleware, async (req, res) => {
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
        const passwordMatch = await (0, bcrypt_1.compare)(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        // Generate and send the JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
        }, JWT_SECRET);
        res.json({
            message: "User signed in successfully",
            token: token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
userRouter.get("/user", authmiddleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = res.locals.userId;
        console.log(userId);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = userRouter;
