export class Role {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }
}
