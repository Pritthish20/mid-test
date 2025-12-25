import { Router } from "express";
import { getStudents } from "../controllers/student.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { roleTeacher } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", authenticate, roleTeacher, getStudents);

export default router;
