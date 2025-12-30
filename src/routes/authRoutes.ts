import {Router} from "express";
import {asyncHandler} from "../middleware/asyncHandler.js";
import * as c from "../controllers/AuthController.js"
import {requireAuth} from "../middleware/auth.js";
import {validateBody} from "../middleware/validate.js";
import {loginSchema, registerSchema,} from "../validators/authValidators.js";
import {authLimiter, loginLimiter} from "../middleware/rateLimiters.js";
import {requireCsrfHeader} from "../middleware/requireCsrfHeader.js";
import {requireAdmin} from "../middleware/requireRole.js";
export const authRouter = Router();

authRouter.post("/register",authLimiter, validateBody(registerSchema),asyncHandler(c.register));
authRouter.post("/login",loginLimiter, validateBody(loginSchema),asyncHandler(c.login));
authRouter.post("/logout", asyncHandler(c.logout));
authRouter.post("/refresh",requireCsrfHeader, asyncHandler(c.refresh));
authRouter.get("/profile",requireAuth, asyncHandler(c.profile))
authRouter.get("/role",requireAuth,requireAdmin,asyncHandler(c.adminSecret))