import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export function requireCsrfHeader(req: Request, res: Response, next: NextFunction) {
    const v = req.headers["x-csrf"];
    if (v !== "1") throw new AppError(403, "CSRF blocked");
    next();
}
