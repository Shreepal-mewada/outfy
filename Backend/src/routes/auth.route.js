import { Router } from "express";
import { registerUser, loginUser} from "../controllers/auth.controller.js";
import { validateRegisterUser,validateLoginUser } from "../validatores/auth.validator.js";


const authRouter = Router();

authRouter.post("/register", validateRegisterUser, registerUser);
authRouter.post("/login", validateLoginUser, loginUser);

export default authRouter;
