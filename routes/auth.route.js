import { Router } from "express"

import {signup,login,getProfile} from "../controllers/auth.controller.js"
import {authenticate} from "../middlewares/auth.middleware.js"
import {validateBody} from "../middlewares/validator.middleware.js"
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/signup",validateBody(signupSchema),signup)
router.post("/login",validateBody(loginSchema),login)
router.get("/me",authenticate,getProfile)

export default router;