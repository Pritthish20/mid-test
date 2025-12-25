import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "../middlewares/validator.middleware.js";
import {
  addStudentBodySchema,
  addStudentParamsSchema,
  createClassSchema,
  getMyAttendenceParamsSchema,
} from "../schemas/class.schema.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  requiredRole,
  classTeacher,
  roleTeacher,
  classAccess,
  roleStudent,
} from "../middlewares/role.middleware.js";
import {
  addStudent,
  createClass,
  getClass,
  getMyAttendence,
} from "../controllers/class.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  roleTeacher,
  validateBody(createClassSchema),
  createClass
);
router.post(
  "/:id/add-student",
  authenticate,
  roleTeacher,
  validateBody(addStudentBodySchema),
  validateParams(addStudentParamsSchema),
  classTeacher,
  addStudent
);
router.get(
  "/:id",
  authenticate,
  validateParams(addStudentParamsSchema),
  classAccess,
  getClass
);
router.get(
  "/:id/my-attendence",
  authenticate,
  roleStudent,
  classAccess,
  validateParams(getMyAttendenceParamsSchema),
  getMyAttendence
);

export default router;
