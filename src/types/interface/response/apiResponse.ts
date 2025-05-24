export interface ApiResponse<T> {
    message: string
    data:T
    error?: any
    pagination?: Pagination
}

export interface Pagination {
  current_page: number;
  has_next: boolean;
  limit: number;
  total_items: number;
  total_pages: number;
}