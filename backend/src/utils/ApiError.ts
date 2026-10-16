export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: any[];
  public readonly success: boolean = false;

  constructor(statusCode: number, message: string = 'Something went wrong', errors: any[] = [], stack: string = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
