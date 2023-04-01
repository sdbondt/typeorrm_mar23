import {Length, IsEmail, Matches } from "class-validator"
import { StatusCodes } from "http-status-codes"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm"
import { emailRegex, passwordRegex } from "../constants/constants"
import { UserRepository } from "../data-source"
import CustomError from "../errorhandlers/customError"
import { Post } from "./Post"
import { Comment } from "./Comment"
const { BAD_REQUEST } = StatusCodes

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(2, 20)
    username: string

    @Column({ unique: true })
    @IsEmail()
    email: string

    @Column()
    @Matches(passwordRegex)
    password: string

    @OneToMany(
        () => Post,
        post => post.user,
        { onDelete: "CASCADE"}
    )
    posts: Post[]

    @OneToMany(
        () => Comment,
        comment => comment.user,
        { onDelete: 'CASCADE'}
    )
    comments: Comment[]

    // save a hashed version of the password before user creation or password update
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
        }
    }


    // return user jwt token
    getJWT(): string {
        return jwt.sign(
            { userId: this.id },
            process.env.JWT_SECRET,
            { expiresIn: '30d'}
        )
    }

    // check if user password is correct
    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password)
    }

    static async isValidEmail(email: string) {
        return emailRegex.test(email)
    }

    static async isValidPassword(password: string) {
        return passwordRegex.test(password)
    }

    // signup user
    static async signup(email: string, username: string, password: string): Promise<string> {
        if (!username || username.length < 2 || username.length > 20) throw new CustomError('Username must be at least 2 and maximum 20 characters long.', BAD_REQUEST)
        const isValidEmail = await this.isValidEmail(email)
        const isValidPassword = await this.isValidPassword(password)
        if (!isValidEmail) throw new CustomError('Must supply a valid email.', BAD_REQUEST)
        if (!isValidPassword) throw new CustomError('Password must contain uppercase, lowercase and numeric value.', BAD_REQUEST)
        const emailExists = await UserRepository.findOne({ where: { email } })
        if (emailExists) {
            throw new CustomError('Email already exists.', BAD_REQUEST)
        } 
        if (!this.isValidPassword(password)) throw new CustomError('Password must be 6 characters long and contain a uppercase, lowercase and numeric value.', BAD_REQUEST)
        const user = UserRepository.create({
            email,
            username,
            password
        })
        await UserRepository.save(user)
        return user.getJWT()
    }
    
    // login user
    static async login(email: string, password: string): Promise<string> {
        const user = await UserRepository.findOne({ where: { email } })
        if (!user) throw new CustomError('Invalid credentials.', BAD_REQUEST)
        const isValidPassword = await user.comparePassword(password)
        if (!isValidPassword) throw new CustomError('Invalid credentials.', BAD_REQUEST)
        return user.getJWT()
    }
}
