export interface ApiResponse<T> {
    message: string
    data:T
    error?: any
    pagination?: PaginationReponse
}

export interface PaginationReponse {
  current_page: number;
  has_next: boolean;
  limit: number;
  total_items: number;
  total_pages: number;
}