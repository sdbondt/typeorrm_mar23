import express from 'express'
import { createPost, deletePost, getPost, getPosts, updatePost } from '../controllers/postController'
import commentRouter from './commentRoutes'
const router = express.Router()

router.use('/:postId/comments', commentRouter)
router.post('/', createPost)
router.patch('/:postId', updatePost)
router.delete('/:postId', deletePost)
router.get('/:postId', getPost)
router.get('/', getPosts)

export default router