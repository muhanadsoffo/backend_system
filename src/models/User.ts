import mongoose, {Schema} from "mongoose";

export type UserDoc = {
    email: string;
    passwordHash: string;
    created_at: string;
    updated_at: string;
}
const s= new Schema<UserDoc>({
    email: {type: String, required: true, unique: true, trim: true, lowercase: true},
    passwordHash: {type: String, required: true},

}, { timestamps: true });

export const User = mongoose.models.User ?? mongoose.model<UserDoc>("User", s);
