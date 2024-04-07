"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const todos_1 = __importDefault(require("./todos"));
const ai_1 = __importDefault(require("./ai"));
const router = express_1.default.Router();
router.use("/user", user_1.default);
router.use("/todos", todos_1.default);
router.use("/ai", ai_1.default);
exports.default = router;
