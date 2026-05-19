export class ApiResponse<T> {
  response!: string;
  data!: T | null;
  message!: string;

  static success<T>(data: T, message = 'Operación exitosa'): ApiResponse<T> {
    return { response: 'SUCCESS', data, message };
  }

  static error<T>(message: string, data: T | null = null): ApiResponse<T> {
    return { response: 'ERROR', data, message };
  }

  static notFound<T>(message = 'Recurso no encontrado'): ApiResponse<T> {
    return { response: 'NOT_FOUND', data: null, message };
  }

  static validationError<T>(message: string, data: T | null = null): ApiResponse<T> {
    return { response: 'VALIDATION_ERROR', data, message };
  }
}
