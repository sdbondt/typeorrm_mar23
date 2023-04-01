import { NextFunction, Response } from "express"
import asyncHandler from "../errorhandlers/asyncHandler"
import { AuthRequest } from "../middleware/auth"
import { StatusCodes } from "http-status-codes"
import { Comment } from "../entity/Comment"
const { CREATED, OK } = StatusCodes


export const createComment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { content } = req.body
    const { postId } = req.params
    const comment = await Comment.createComment(req.user, postId, content)
    res.status(CREATED).json({ comment })
})

export const updateComment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { content } = req.body
    const { commentId } = req.params
    const comment = await Comment.updateComment(req.user, commentId, content)
    res.status(OK).json({ comment })
})

export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { commentId } = req.params
    await Comment.deleteComment(req.user, commentId)
    res.status(OK).json({ msg: 'Comment deleted.'})
})

export const getComment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { commentId } = req.params
    const comment = await Comment.findById(commentId)
    res.status(OK).json({ comment })
})

export const getComments = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { postId } = req.params
    const comments = await Comment.getComments(postId)
    res.status(OK).json({ comments })
})