import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { User } from "../entity/User";
import asyncHandler from "../errorhandlers/asyncHandler"
const { CREATED, OK } = StatusCodes

export const signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body
    const token = await User.signup(email, username, password)
    res.status(CREATED).json({ token })
})

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const token = await User.login(email, password)
    res.status(OK).json({ token })
})