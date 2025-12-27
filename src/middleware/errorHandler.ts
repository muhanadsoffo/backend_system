import {NextFunction,Request,Response} from "express";

export function errorHandler(err:any ,req: Request, res: Response, next: NextFunction) {
    const msg= typeof err?.message ==="string" ? err.message: "server error";
    const code = typeof err?.status === "number" ? err.status: 500;
    res.status(code).json({ message: msg});

}