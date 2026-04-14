import { Router } from "express";
import { registerUser, loginUser, googleAuth } from "../controllers/auth.controller.js";
import { validateRegisterUser,validateLoginUser } from "../validatores/auth.validator.js";
import {logoutUser} from "../controllers/auth.controller.js";
import { getAllProducts } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", validateRegisterUser, registerUser);
authRouter.post("/login", validateLoginUser, loginUser);
authRouter.post("/google", googleAuth);
authRouter.post("/logout", logoutUser);
authRouter.get("/allposts", getAllProducts);


export default authRouter;
