import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { roleTeacher, classTeacherFromBody } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validator.middleware.js";
import { startAttendenceBodySchema } from "../schemas/attendance.schema.js";
import { startAttendence } from "../controllers/attendance.controller.js";

const router = Router();

router.post(
  "/start",
  authenticate,
  roleTeacher,
  validateBody(startAttendenceBodySchema),
  classTeacherFromBody,
  startAttendence
);

export default router;
