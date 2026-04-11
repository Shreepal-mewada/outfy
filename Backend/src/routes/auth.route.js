import { Router } from "express";
import { registerUser, loginUser, googleAuth } from "../controllers/auth.controller.js";
import { validateRegisterUser,validateLoginUser } from "../validatores/auth.validator.js";


const authRouter = Router();

authRouter.post("/register", validateRegisterUser, registerUser);
authRouter.post("/login", validateLoginUser, loginUser);
authRouter.post("/google", googleAuth);

export default authRouter;
