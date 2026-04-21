import { Router } from "express";
import { registerUser, loginUser, googleAuth, logoutUser, getMe } from "../controllers/auth.controller.js";
import { validateRegisterUser, validateLoginUser } from "../validatores/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", validateRegisterUser, registerUser);
authRouter.post("/login", validateLoginUser, loginUser);
authRouter.post("/google", googleAuth);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", getMe);




export default authRouter;

