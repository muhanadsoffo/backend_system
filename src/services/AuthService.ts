import {User} from "../models/User.js";
import bcrypt from "bcrypt";
import {makeAccessToken, makeRefreshToken, sha256, verifyRefreshToken} from "../auth/tokens.js";
import {RefreshToken} from "../models/RefreshToken.js";
import mongoose from "mongoose";

function bad(status: number, message: string): never {
    const e: any = new Error(message);
    e.status = status;
    throw e;
}

export async function register(body: any,) {
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!email || !password) bad(400, "email and password are required");
    if (password.length < 8) bad(400, "password must be at least 8 characters");

    const exists = await User.findOne({ email});
    if (exists) bad(409, "email already exists");

    const passwordHash = await bcrypt.hash(password, 12);
    const u = await User.create({email, passwordHash});

    const accessToken = makeAccessToken(u._id.toString());
    const {token: refreshToken} = makeRefreshToken(u._id.toString());

    await RefreshToken.create({
        userId: u._id,
        tokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await u.save();
    return {
        user: { id: u._id, email: u.email },
        accessToken,
        refreshToken,
    };

}

export async function login(body: any, ) {
    const email = String(body?.email ?? "" ).trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!email || !password) bad(400, "email and password are required");
    const u = await User.findOne({ email});

    if (!u) bad(409, "Invalid email or password");

    const ok = await bcrypt.compare(password, u.passwordHash);
    if(!ok) bad(401, "Invalid email or password");

    const accessToken = makeAccessToken(u._id.toString());
    const { token: refreshToken } = makeRefreshToken(u._id.toString());

    await RefreshToken.create({
        userId: u._id,
        tokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });



    return {
        user: { id: u._id, email: u.email },
        accessToken,
        refreshToken,
    };
}

export async function logout(cookieToken: string | undefined) {
    if(cookieToken){
        const tokenHash =sha256(cookieToken);
        await RefreshToken.updateOne({tokenHash, revokedAt: null},{$set:{revokedAt: new Date()}});
    }

    return {ok : true};
}
export async function refresh(cookieToken: string | undefined) {
    if (!cookieToken) bad(401, "missing refresh token");

    let payload: { userId: string; jti: string; exp: number };

    try {
        payload = verifyRefreshToken(cookieToken);
    } catch {
        bad(401, "invalid refresh token");
    }

    const tokenHash = sha256(cookieToken);

    const rt = await RefreshToken.findOne({ tokenHash, revokedAt: null });
    if (!rt) bad(401, "refresh token revoked");
    if (rt.expiresAt.getTime() < Date.now()) bad(401, "refresh token expired");

    rt.revokedAt = new Date();
    await rt.save();

    const accessToken = makeAccessToken(payload.userId);
    const { token: newRefreshToken } = makeRefreshToken(payload.userId);

    await RefreshToken.create({
        userId: new mongoose.Types.ObjectId(payload.userId),
        tokenHash: sha256(newRefreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, newRefreshToken };
}
