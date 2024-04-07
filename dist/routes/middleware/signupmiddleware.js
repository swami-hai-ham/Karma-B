"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupmiddleware = void 0;
const userSchema_1 = require("../zod/userSchema");
const signupmiddleware = (req, res, next) => {
    try {
        // Validate the request body against the User schema
        console.log(req.body);
        const validatedUser = userSchema_1.UserSign.parse(req.body);
        // If validation passes, attach the validated user to the request
        next();
    }
    catch (err) {
        const error = err;
        // If validation fails, return a 400 Bad Request with the validation error
        console.error("Validation error:", error); // Log the validation errors for debugging
        // Check if error is defined and has errors property
        res
            .status(400)
            .json({ error: "Invalid input. Please check the provided data." });
    }
};
exports.signupmiddleware = signupmiddleware;
