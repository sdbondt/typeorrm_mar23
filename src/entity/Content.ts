import { StatusCodes } from "http-status-codes"
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Length } from "class-validator"
import { User } from "./User"
import CustomError from "../errorhandlers/customError"
import { Comment } from "./Comment"
import { Post } from "./Post"
const { BAD_REQUEST, UNAUTHORIZED } = StatusCodes

@Entity()
export abstract class Content {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(1, 10000)
    @Index()
    content: string

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => User)
    user: User

    public authorizeUser(user: User, content: Content): void {
        if(content.user.id != user.id) throw new CustomError('Unauthorized to perform this action.', UNAUTHORIZED)
    }
}
