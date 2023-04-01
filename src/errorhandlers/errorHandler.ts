import { Response, Request, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import CustomError, { CustomErrorType } from './customError'
const { INTERNAL_SERVER_ERROR } = StatusCodes

export type IError = Error | CustomErrorType

export const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  let customError = {
    statusCode: 'statusCode' in err ? err.statusCode : INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }
  return res.status(customError.statusCode).json({ msg: customError.msg })
}
