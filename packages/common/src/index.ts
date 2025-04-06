import { z } from 'zod'

export const SignupSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
})

export const LoginSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const RoomSchema = z.object({
    slug: z.string()
})