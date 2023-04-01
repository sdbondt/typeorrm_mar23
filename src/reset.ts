import dotenv from 'dotenv'
import { AppDataSource, CommentRepository, PostRepository, UserRepository } from "./data-source"
import { Comment } from './entity/Comment'
import { Post } from './entity/Post'
import { User } from './entity/User'
dotenv.config()

const resetDatabase = async () => {
    try {
        await AppDataSource.initialize()
        await AppDataSource.createQueryBuilder()
            .delete()
            .from(Comment)
            .execute()
        await AppDataSource.createQueryBuilder()
            .delete()
            .from(Post)
            .execute()
        await AppDataSource.createQueryBuilder()
            .delete()
            .from(User)
            .execute()
        const user = UserRepository.create({
            username: process.env.USER_USERNAME,
            password: process.env.USER_PASSWORD,
            email: process.env.USER_EMAIL
        })
        await UserRepository.save(user)
        const userTwo = UserRepository.create({
            username: process.env.USERTWO_USERNAME,
            email: process.env.USERTWO_EMAIL,
            password: process.env.USER_PASSWORD,
        })
        await UserRepository.save(userTwo)
        const posts = [
            {
                user,
                content: 'post 1'
            },
            {
                user,
                content: 'post 2'
            },
            {
                user,
                content: 'post 3'
            }
        ]
        const [postOne, postTwo, postThree] = PostRepository.create(posts)
        await PostRepository.save([postOne, postTwo, postThree])
        const comments = [
            {
                user: userTwo,
                content: 'user two post 1',
                post: postOne
            },
            {
                user,
                content: 'user 1 post 1',
                post: postOne
            },
            {
                user: userTwo,
                content: 'user two post 2',
                post: postTwo
            }
        ]
        const [commentOne, commentTwo, commentThree] = CommentRepository.create(comments)
        await CommentRepository.save([commentOne, commentTwo, commentThree])
        console.log('Database got reset.')
    } catch (e) {
        console.log(e)
    } 
}
resetDatabase()

