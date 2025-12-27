import mongoose, {Schema} from "mongoose";


export type RefreshTokenDoc= {
    userId: mongoose.Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date ;
    updatedAt: Date ;
}
const s = new Schema<RefreshTokenDoc>({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true, index: true, },
    tokenHash: {type: String, required: true, unique: true,index: true},
    expiresAt: {type: Date, required: true,index: true},
    revokedAt: {type: Date, default: null},
}, { timestamps: true });

export const RefreshToken = mongoose.models.RefreshToken ?? mongoose.model<RefreshTokenDoc>("RefreshToken", s);