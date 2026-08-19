import { ErrorCode } from './error-code.enum';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
    public readonly code?: ErrorCode,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
