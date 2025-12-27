import type { Response } from "express";

export const refreshCookieName = "refresh";

export function setRefreshCookie(res: Response, token: string) {
    const secure = (process.env.COOKIE_SECURE ?? "false") === "true";

    res.cookie(refreshCookieName, token, {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        path: "/auth/refresh",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
}

export function clearRefreshCookie(res: Response) {
    const secure = (process.env.COOKIE_SECURE ?? "false") === "true";

    res.clearCookie(refreshCookieName, {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        path: "/auth/refresh",
    });
}
