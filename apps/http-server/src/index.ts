import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config'
import { auth } from './middleware/auth'
import { prisma } from '@repo/db/client'
import { LoginSchema, SignupSchema } from "@repo/common/schema"


const app = express()
const port = process.env.PORT || 3002

app.use(express.json())

app.listen(port, () => {
    console.log(`Sever running on port ${port}`)
})


app.get('/', (req, res) => {
    res.status(200).json({ message: "hello ", JWT_SECRET })
})

app.post("/signup", async (req, res) => {


    const { username, email, password } = req.body

    try {
        SignupSchema.parse({ username, email, password })
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.status(500).json({
                    message: "Unable to store password"
                })
            } else {
                // store data in db
                const user = await prisma.user.create({
                    data: {
                        username,
                        email,
                        password: hash
                    }
                })
                const token = jwt.sign({ userId: user.id }, JWT_SECRET)
                res.status(200).json({ token })
            }
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({ message: "Invalid credentials type" })
    }

})

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        // login validator 
        LoginSchema.parse({ username, password })

        const existingUser = await prisma.user.findUnique({ where: { username } })
        if (!existingUser)
            throw 'user doest not exist'
        const result = await bcrypt.compare(password, existingUser.password)

        if (result) {
            const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET)
            res.status(200).json({ token })
        } else {
            res.status(400).json({ message: "Invalid credentials" })
        }

    } catch (e) {
        console.log(e)
        res.status(400).json({ message: "invalid credentails type" })
    }
})

app.post("/create-room", auth, async (req, res) => {
    res.send(200).json({ message: "Hello" })
})