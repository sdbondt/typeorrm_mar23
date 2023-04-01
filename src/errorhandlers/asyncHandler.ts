import { Response, Request, NextFunction } from 'express'

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      return Promise
                  .resolve(fn(req, res, next))
                  .catch((err) => {
                    return next(err)
                  })
    }
}

export default asyncHandler