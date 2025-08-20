export class ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;

  constructor(success: boolean, data?: T, error?: string) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse<T>(true, data, undefined);
  }

  static failure<T>(error: string): ApiResponse<T> {
    return new ApiResponse<T>(false, undefined, error);
  }
}
