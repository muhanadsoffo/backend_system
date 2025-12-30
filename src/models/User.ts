import mongoose, {Schema} from "mongoose";
import {type Role, Roles} from "../constants/roles.js";

export type UserDoc = {
    email: string;
    passwordHash: string;
    role: Role
    created_at: string;
    updated_at: string;
}
const s= new Schema<UserDoc>({
    email: {type: String, required: true, unique: true, trim: true, lowercase: true},
    passwordHash: {type: String, required: true},
    role: {type: String, enum:Object.values(Roles),default: Roles.USER ,required: true},

}, { timestamps: true });

export const User = mongoose.models.User ?? mongoose.model<UserDoc>("User", s);
