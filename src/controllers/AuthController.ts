import type { Request, Response } from "express";
import  * as s  from "../services/AuthService.js" ;
import {clearRefreshCookie, setRefreshCookie} from "../auth/cookies.js";
import type { AuthedRequest } from "../middleware/auth.js";




export async function register(req: Request, res: Response) {
    const r = await s.register(req.body);
    setRefreshCookie(res, r.refreshToken);
    res.status(201).json({ user: r.user, accessToken: r.accessToken });
}

export async function login(req: Request, res: Response) {
    const r = await s.login(req.body);
    setRefreshCookie(res, r.refreshToken);
    res.json({ user: r.user, accessToken: r.accessToken });
}

export async function refresh(req: Request, res: Response) {
    const r = await s.refresh(req.cookies?.refresh);
    setRefreshCookie(res, r.newRefreshToken);
    res.json({ accessToken: r.accessToken });
}


export async function logout(req: Request, res: Response) {
    const r = await s.logout(req.cookies?.refresh);
    clearRefreshCookie(res)
    res.json(r);
}

export async function profile(req: AuthedRequest, res: Response) {
    const r = await s.profile(req.userId);
    res.json(r)

}