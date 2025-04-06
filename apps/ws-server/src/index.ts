import { WebSocketServer } from "ws";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config'
import { Decoded, User } from '@repo/backend-common/types'

const wss = new WebSocketServer({ port: 8080 })
const users: User[] = []

wss.on('connection', (ws, request) => {
    ws.send('ping')
    if (!request.url) {
        ws.close()
        return;
    }
    const token = new URLSearchParams(request.url.split("?")[1]).get("token")

    if (token == null) {
        ws.close()
        return
    }
    try {

        const parsedToken: Decoded = jwt.verify(token, JWT_SECRET) as Decoded

        if (!parsedToken.userId) {
            ws.close()
            return
        }



        users.push({ ws: ws, rooms: [], userId: parsedToken.userId })

        ws.on('message', (data) => {
            const parsedData = JSON.parse(data.toString())
            const type = parsedData.type
            const roomId = parsedData.roomId
            if (type === "join_room") {
                const user = users.find((user) => user.ws === ws)
                user?.rooms.push(roomId)

            }
            if (type === "leave_room") {
                const user = users.find(user => user.ws === ws)

                if (user?.rooms.includes(roomId))
                    user.rooms = user.rooms.filter((id) => id != roomId)

            }
            if (type === "chat") {
                users.forEach(user => {
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify(parsedData.message))
                    }
                })

            }
        })

    } catch (e) {
        console.log(e)

    }
})