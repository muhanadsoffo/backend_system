import jwt, {Secret, SignOptions} from 'jsonwebtoken'
import crypto from 'crypto'
import "dotenv/config"


const a = process.env.ACCESS_TOKEN_SECRET;
const r = process.env.REFRESH_TOKEN_SECRET;

if (!a) throw new Error('No access token provided');
if (!r) throw new Error('No refresh token provided');

const accessSecret: Secret = a;
const refreshSecret: Secret = r;

export function makeAccessToken(userId: string) {
    const exp: SignOptions["expiresIn"] = (process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m") as any;
    return jwt.sign({userId}, accessSecret, {expiresIn: exp})
}

export function makeRefreshToken(userId: string) {
    const exp: SignOptions["expiresIn"] = (process.env.REFRESH_TOKEN_EXPIRES_IN ?? "30d") as any;
    const jti = crypto.randomUUID();
    const token = jwt.sign({userId, jti}, refreshSecret, {expiresIn: exp});
    return {token, jti};
}


export function verifyRefreshToken(token: string) {
    return jwt.verify(token, refreshSecret) as {
        userId: string;
        jti: string;
        iat: number;
        exp: number;
    };
}

export function sha256(x: string) {
    return crypto.createHash("sha256").update(x).digest("hex");
}

