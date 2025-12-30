import {User} from "../models/User.js";
import bcrypt from "bcrypt";
import {makeAccessToken, makeRefreshToken, sha256, verifyRefreshToken} from "../auth/tokens.js";
import {RefreshToken} from "../models/RefreshToken.js";
import mongoose from "mongoose";
import {AppError} from "../errors/AppError.js";
import z from "zod";
import {loginSchema, registerSchema} from "../validators/authValidators.js";


type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export async function register(body: RegisterInput) {
    const { email, password } = body;


    const exists = await User.findOne({ email});
    if (exists) throw new AppError(409, "email already exists");

    const passwordHash = await bcrypt.hash(password, 12);
    const u = await User.create({email, passwordHash});

    const accessToken = makeAccessToken(u._id.toString(),u.role);
    const {token: refreshToken} = makeRefreshToken(u._id.toString());

    await RefreshToken.create({
        userId: u._id,
        tokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });


    return {
        user: { id: u._id, email: u.email },
        accessToken,
        refreshToken,
    };

}

export async function login(body: LoginInput ) {
    const { email, password } = body;

    const u = await User.findOne({ email});

    if (!u) throw new AppError(401,"Invalid email or password")


    const ok = await bcrypt.compare(password, u.passwordHash);
    if(!ok) throw new AppError(401,"Invalid email or password")

    const accessToken = makeAccessToken(u._id.toString(),u.role);
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
    if (!cookieToken) throw new AppError(401,"missing refresh token")


    let payload: { userId: string; jti: string; exp: number };

    try {
        payload = verifyRefreshToken(cookieToken);
    } catch {
        throw new AppError(401, "invalid refresh token");
    }

    const tokenHash = sha256(cookieToken);

    const rt = await RefreshToken.findOne({ tokenHash, revokedAt: null });
    if (!rt) throw new AppError(401, "refresh token revoked");
    if (rt.expiresAt.getTime() < Date.now()) throw new AppError(401, "refresh token expired");

    const u = await User.findById(payload.userId).select("_id role");
    if (!u) throw new AppError(401, "user not found");

    rt.revokedAt = new Date();
    await rt.save();

    const accessToken = makeAccessToken(payload.userId,u.role);
    const { token: newRefreshToken } = makeRefreshToken(payload.userId);

    await RefreshToken.create({
        userId: new mongoose.Types.ObjectId(payload.userId),
        tokenHash: sha256(newRefreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, newRefreshToken };
}

export async function profile(userId?: string) {
    if (!userId) throw new AppError(401, "not authenticated");

    const u = await User.findById(userId).select("_id email createdAt");
    if (!u) throw new AppError(404, "user not found");

    return u;
}
