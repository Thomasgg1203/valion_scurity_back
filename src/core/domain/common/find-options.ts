export interface FindOptions {
  skip?: number;
  take?: number;
  search?: string;
  filters?: Record<string, unknown>;
}
