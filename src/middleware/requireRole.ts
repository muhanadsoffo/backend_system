import {AuthedRequest} from "./auth.js";
import {NextFunction, RequestHandler} from "express";
import {Role, Roles} from "../constants/roles.js";
import {AppError} from "../errors/AppError.js";

export const requireAdmin: RequestHandler = (req, res, next) => {
    const r = req as AuthedRequest;

    if (!r.role) throw new AppError(401, "not authenticated");
    if (r.role !== Roles.ADMIN) throw new AppError(403, "access denied");

    next();
};
