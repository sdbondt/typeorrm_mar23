import { StatusCodes } from "http-status-codes"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { Length } from "class-validator"
import CustomError from "../errorhandlers/customError"
import { Post } from "./Post"
import { User } from "./User"
import { CommentRepository } from "../data-source"
import { Content } from "./Content"
const { BAD_REQUEST, UNAUTHORIZED } = StatusCodes

@Entity()
export class Comment extends Content {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(1, 10000)
    content: string

    // @ManyToOne(
    //     () => User,
    //     user => user.comments
    // )
    // user: User

    @ManyToOne(
        () => Post,
        post => post.comments
    )
    post: Post

    @CreateDateColumn()
    createdAt: Date

    static async createComment(user: User, postId: string, content: string): Promise<Comment> {
        const post = await Post.findById(postId)
        if (!content || content.length > 10000) throw new CustomError('You must add some content that\'s maximum 10000 characters long.', BAD_REQUEST)
        const comment = CommentRepository.create({
            user,
            post,
            content
        })
        return CommentRepository.save(comment)
    }

    static async findById(commentId: string): Promise<Comment> {
        if (!commentId) throw new CustomError('Invalid comment id.', BAD_REQUEST)
        const id = parseInt(commentId)
        if (isNaN(id)) throw new CustomError('Invalid comment id.', BAD_REQUEST)
        const comment = await CommentRepository.findOne({
            where: { id },
            relations: ['user', 'post']
        })
        if (!comment) throw new CustomError('No comment found.', BAD_REQUEST)
        return comment
    }

    static async updateComment(user: User, commentId: string, content: string): Promise<Comment> {
        const comment = await this.findById(commentId)
        comment.authorizeUser(user, comment)
        if (!content || content.length > 10000) throw new CustomError('You must add some content that\'s maximum 10000 characters long.', BAD_REQUEST)
        comment.content = content
        return CommentRepository.save(comment)
    }

    static async deleteComment(user: User, commentId: string): Promise<void> {
        const comment = await this.findById(commentId)
        comment.authorizeUser(user, comment)
        await CommentRepository.remove(comment)
    }

    static async getComments(postId: string) {
        const post = await Post.findById(postId)
        return post.comments
    }
}