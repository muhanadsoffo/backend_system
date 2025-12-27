import type { Request, Response, NextFunction } from "express";
import jwt, {Secret} from "jsonwebtoken";
import "dotenv/config"
export type AuthedRequest = Request & { userId?: string };

const a = process.env.ACCESS_TOKEN_SECRET;
if (!a) throw new Error("Missing ACCESS_TOKEN_SECRET");

const accessSecret: Secret = a;

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
    const h = req.headers.authorization;
    const token = h?.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing access token" });

    try {
        const p = jwt.verify(token, accessSecret) as any;
        req.userId = String(p.userId);
        next();
    } catch {
        return res.status(401).json({ message: "Invalid access token" });
    }
}