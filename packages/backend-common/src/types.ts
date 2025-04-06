import WebSocket from "ws"

export type Decoded ={
    userId: string
}

export type User={
    ws : WebSocket,
    rooms: string[],
    userId: string
}