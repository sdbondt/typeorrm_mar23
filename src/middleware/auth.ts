import { NextFunction, Request, Response } from "express"
import asyncHandler from "../errorhandlers/asyncHandler"
import CustomError from "../errorhandlers/customError"
import { StatusCodes } from "http-status-codes"
const { UNAUTHORIZED } = StatusCodes
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserRepository } from "../data-source"
import { User } from "../entity/User"

export interface AuthRequest extends Request {
    user?: User
}

export const auth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) throw new CustomError('Unauthorized.', UNAUTHORIZED)
    const token = authHeader.split(' ')[1]
    if (!token) throw new CustomError('Unauthorized.', UNAUTHORIZED)
    let payload: JwtPayload = {}
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    } catch (e) {
        throw new CustomError('Authentication invalid.', UNAUTHORIZED)
    }
    if (!payload || !payload?.userId) throw new CustomError('Authentication invalid.', UNAUTHORIZED)
    const user = await UserRepository.findOne({ where: { id: payload.userId }})
    if (!user) throw new CustomError('Authentication invalid.', UNAUTHORIZED)
    req.user = user
    next() 
})