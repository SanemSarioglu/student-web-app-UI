// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
} 