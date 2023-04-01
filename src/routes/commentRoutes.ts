import express from 'express'
import { createComment, deleteComment, getComment, getComments, updateComment } from '../controllers/commentController'
const router = express.Router({ mergeParams: true })

router.post('/', createComment)
router.patch('/:commentId', updateComment)
router.delete('/:commentId', deleteComment)
router.get('/:commentId', getComment)
router.get('/', getComments)

export default router