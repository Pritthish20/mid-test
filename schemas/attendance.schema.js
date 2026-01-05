import { z } from "zod";

export const startAttendenceBodySchema = z.object({
  classId: z.string().trim().min(1),
});
