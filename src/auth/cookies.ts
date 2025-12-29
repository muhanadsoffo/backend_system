import type { Response } from "express";

export const refreshCookieName = "refresh";

export function setRefreshCookie(res: Response, token: string) {
    const isProd = process.env.NODE_ENV === "production";

    res.cookie(refreshCookieName, token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/auth/refresh",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
}

export function clearRefreshCookie(res: Response) {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie(refreshCookieName, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/auth/refresh",
    });
}
