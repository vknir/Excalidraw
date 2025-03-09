import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config";

export function auth(req : Request, res:Response, next : NextFunction){
    const token = req.headers["authorization"] || "";
    const decoded = jwt.verify(token, JWT_SECRET)
    if(!decoded ){
        res.status(400).json({message:"Invalid token"})
    }
    // checj whether userId exists or nor
    next();
    
}