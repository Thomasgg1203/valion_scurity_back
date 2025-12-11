export interface Coverage {
  id: string;
  code: string;
  name: string;
  description?: string;
  lineOfBusinessId: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
