import { StatusCodes } from 'http-status-codes'
import {ZodError} from 'zod'

export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
        this.message = message;
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.message = message;
    }
} 

export function makeError<TError extends Error>(error: TError) {
    const defaultError = {
        name: error.name,
        message: error.message,
    };

    if (error instanceof ConflictError) {
        return {
            statusCode: StatusCodes.CONFLICT,
            error: defaultError,
        };
    }    

    if (error instanceof NotFoundError) {
  return{
    statusCode: StatusCodes.NOT_FOUND,
    error: defaultError,
  };
}
  }

  