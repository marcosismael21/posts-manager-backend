import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../responses/api-response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawMessage =
      exception instanceof HttpException
        ? (exception.getResponse() as any)?.message ?? exception.message
        : 'Error interno del servidor';

    const message = Array.isArray(rawMessage)
      ? rawMessage.join(', ')
      : rawMessage;

    const isNotFound = status === HttpStatus.NOT_FOUND;
    const isValidation = status === HttpStatus.BAD_REQUEST;

    const body = isNotFound
      ? ApiResponse.notFound(message)
      : isValidation
        ? ApiResponse.validationError(message)
        : ApiResponse.error(message);

    response.status(status).json({ ...body, path: request.url });
  }
}
