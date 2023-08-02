import { StatusCodes } from "http-status-codes"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from "typeorm"
import { Length } from "class-validator"
import { GetPostsResults } from "../constants/interfaces"
import { PostRepository } from "../data-source"
import CustomError from "../errorhandlers/customError"
import { Comment } from "./Comment"
import { User } from "./User"
import { Content } from "./Content"
const { BAD_REQUEST, UNAUTHORIZED } = StatusCodes

@Entity()
export class Post extends Content {
    // @ManyToOne(
    //     () => User,
    //     user => user.posts
    // )
    // user: User
    
    @OneToMany(
        () => Comment,
        comment => comment.post
    )
    comments: Comment[]

    static async createPost(user: User,content: string): Promise<Post> {
        if (!content || content.length > 10000) throw new CustomError('You must add some content that\'s maximum 10000 characters long.', BAD_REQUEST)
        const post = PostRepository.create({
            content,
            user
        })
        return PostRepository.save(post)
    }

    static async findById(postId: string): Promise<Post> {
        if (!postId) throw new CustomError('Invalid post id.', BAD_REQUEST)
        const id = parseInt(postId)
        if (isNaN(id)) throw new CustomError('Invalid post id.', BAD_REQUEST)
        const post = await PostRepository.findOne(
            {
                where: { id },
                relations: ['user', 'comments', 'comments.user']
            },
            )
        if (!post) throw new CustomError('No post found.', BAD_REQUEST)
        return post
    }

    static async updatePost(user: User, postId: string, content: string): Promise<Post> {
        const post = await this.findById(postId)
        post.authorizeUser(user, post)
        if (!content || content.length > 10000) throw new CustomError('You must add some content that\'s maximum 10000 characters long.', BAD_REQUEST)
        post.content = content
        return PostRepository.save(post)
    }

    static async deletePost(user: User, postId: string): Promise<void> {
        const post = await this.findById(postId)
        post.authorizeUser(user, post)
        await PostRepository.remove(post)
    }

    static async getPosts(q?: string, pageQuery?: string, limitQuery?: string, directionQuery?: string): Promise<GetPostsResults> {
        let page = pageQuery && Number.isInteger(parseInt(pageQuery)) && parseInt(pageQuery) > 0 ? parseInt(pageQuery) : 1
        const limit = limitQuery && Number.isInteger(parseInt(limitQuery)) && parseInt(limitQuery) ? parseInt(limitQuery) : 10
        const direction = directionQuery == 'asc' ? 'ASC' : 'DESC'
        let query = PostRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.comments', 'comment')
        
        if (q) {
            query = query.where('post.content LIKE :search OR user.username LIKE :search OR comment.content LIKE :search', { search: `%${q}%` })
        }
        const totalCount = await query.getCount()
        const maxPage = Math.ceil(totalCount / limit)
        if (page > maxPage) page = maxPage
        const skip = (page - 1) * limit
        const posts = await query
            .orderBy('post.createdAt', direction)
            .skip(skip)
            .take(limit)
            .getMany()
        return {
            posts,
            page,
            maxPage,
            totalCount
        }
    }
}


