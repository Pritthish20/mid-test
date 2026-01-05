import z from "zod";

export const createClassSchema = z.object({
    className: z.string().trim().min(1),
})

export const addStudentParamsSchema = z.object({
    id:z.string().trim().min(1)
})

export const addStudentBodySchema = z.object({
    studentId: z.string().trim().min(1)
})

export const getMyAttendenceParamsSchema = z.object({
    id: z.string().trim().min(1)
})