import z from "zod"
import dotenv from 'dotenv'

dotenv.config()

const envSchema= z.object({
    NODE_ENV: z.enum(["dev","prod"]).default("dev"),
    PORT: z.coerce.number().int().min(1).max(65555).default(3000),
    MONGO_URI: z.string().min(1,"MONGO_URI is required"),
    JWT_SECRET: z.string().min(10,"JWT_SECRET is required"),
    JWT_EXPIRES: z.string().default("2d"),
    FRONTEND_URI: z.string().min(1,"FRONTEND_URI is required"),
})

const parsed= envSchema.safeParse(process.env);

if(!parsed.success){
    console.error("Invalid environmental variables: ")
    console.error(parsed.error)
    process.exit(1);
}

export const env=parsed.data;