import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config'
import { auth } from './middleware/auth'

const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Sever running on port ${port}`)
})


app.get('/', (req, res) => {
    res.status(200).json({ message: "hello " })
})

app.post("/signup", async (req, res) => {


    const { username, email, password } = req.body
    // import signup validator 
    try {

        bcrypt.hash(password, 5, (err, hash) => {
            if (err) {
                res.status(500).json({
                    message: "Unable to store password"
                })
            } else {
                // store data in db
                const token = jwt.sign({ userId: 1 }, JWT_SECRET)
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
        const actualPassword = "1"; //fetch from db

        const result = await bcrypt.compare(password, actualPassword)

        if (result) {
            const token = jwt.sign({ userId: 1 }, JWT_SECRET)
            res.status(200).json({ token })
        } else {
            res.status(400).json({ message: "Invalid credentials" })
        }

    } catch (e) {
        console.log(e)
        res.status(400).json({ message: "invalid credentails type" })
    }
})

app.post("/create-room", auth, async (req, res)=>{
    
})