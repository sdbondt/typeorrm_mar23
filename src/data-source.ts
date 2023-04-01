import dotenv from 'dotenv'
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Comment } from './entity/Comment'
import { Post } from './entity/Post'
import { User } from "./entity/User"
dotenv.config()



export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST as string,
    port: 5432,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Post, Comment],
    migrations: [],
    subscribers: [],
})

export const UserRepository = AppDataSource.getRepository(User)
export const PostRepository = AppDataSource.getRepository(Post)
export const CommentRepository = AppDataSource.getRepository(Comment)
