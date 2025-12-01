export interface FindOptions {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, unknown>;
}
