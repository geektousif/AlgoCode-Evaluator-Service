/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ ...req.body });
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        data: {},
        error: error,
      });
    }
  };
