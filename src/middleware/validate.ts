import {ZodTypeAny } from "zod";
import {NextFunction,Request, Response} from "express";
import {AppError} from "../errors/AppError.js";

export function validateBody(schema: ZodTypeAny ){
    return (req: Request, res: Response, next: NextFunction) => {
        const r = schema.safeParse(req.body);
        if(!r.success) {
            const msg= r.error.issues.map(i=> i.message).join("\n");
            return next(new AppError(400, msg));
        }
        req.body =r.data;
        next();
    }
}