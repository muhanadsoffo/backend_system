import {Router} from "express";
import {asyncHandler} from "../middleware/asyncHandler.js";
import * as c from "../controllers/AuthController.js"
export const authRouter = Router();

authRouter.post("/register", asyncHandler(c.register));
authRouter.post("/login", asyncHandler(c.login));
authRouter.post("/logout", asyncHandler(c.logout));
authRouter.post("/refresh", asyncHandler(c.refresh));