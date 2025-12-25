import z from "zod";

export const createClassSchema = z.object({
    className:z.string().trim().min(3)
})

export const addStudentParamsSchema = z.object({
    id:z.string().trim().min(3)
})

export const addStudentBodySchema = z.object({
    studentId: z.string().trim().min(3)
})

export const getMyAttendenceParamsSchema = z.object({
    id: z.string().trim().min(3)
})