import { NextFunction, Request, Response } from "express"
import { Post } from "../entity/Post"
import asyncHandler from "../errorhandlers/asyncHandler"
import { AuthRequest } from "../middleware/auth"
import { StatusCodes } from "http-status-codes"
import { GetPostsQuery } from "../constants/interfaces"
const { CREATED, OK } = StatusCodes


export const createPost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { content } = req.body
    const post = await Post.createPost(req.user, content)
    res.status(CREATED).json({ ...post, comments: [], user: req.user })
})

export const updatePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { postId } = req.params
    const { content } = req.body
    const post = await Post.updatePost(req.user, postId, content)
    res.status(OK).json({ post })
})

export const deletePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { postId } = req.params
    await Post.deletePost(req.user, postId)
    res.status(OK).json({ msg: 'Post got deleted.'})
})

export const getPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params
    const post = await Post.findById(postId)
    res.status(OK).json({ post })
})

export const getPosts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { q, direction, limit, page: queryPage } = req.query as GetPostsQuery
    const { posts, totalCount, page, maxPage } = await Post.getPosts(q, queryPage, limit, direction)
    res.status(OK).json({
        posts,
        totalCount,
        page,
        maxPage
    })
})