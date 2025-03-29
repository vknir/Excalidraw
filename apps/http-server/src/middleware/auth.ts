import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/backend-common/config";
import { Decoded } from "@repo/backend-common/types"

export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] || "";
    const decoded: Decoded = jwt.verify(token, JWT_SECRET) as Decoded
    if (!decoded) {
        res.status(400).json({ message: "Invalid token" })
    }
    // checj whether userId exists or nor
    req.userId = decoded.userId
    next();

}