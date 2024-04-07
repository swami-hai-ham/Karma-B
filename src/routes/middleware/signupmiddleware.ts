import { Request, Response, NextFunction } from "express";
import { UserSign } from "../zod/userSchema";

export const signupmiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body against the User schema
    console.log(req.body);
    const validatedUser = UserSign.parse(req.body);

    // If validation passes, attach the validated user to the request

    next();
  } catch (err) {
    const error = err as Error;
    // If validation fails, return a 400 Bad Request with the validation error
    console.error("Validation error:", error); // Log the validation errors for debugging

    // Check if error is defined and has errors property

    res
      .status(400)
      .json({ error: "Invalid input. Please check the provided data." });
  }
};
