import { ApiResponse } from './api-response';

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiPaginatedResponse<T> {
  response!: string;
  data!: PaginatedData<T> | null;
  message!: string;

  static success<T>(
    data: PaginatedData<T>,
    message = 'Operación exitosa',
  ): ApiPaginatedResponse<T> {
    return { response: 'SUCCESS', data, message };
  }

  static error<T>(message: string): ApiPaginatedResponse<T> {
    return ApiResponse.error(message) as unknown as ApiPaginatedResponse<T>;
  }
}
