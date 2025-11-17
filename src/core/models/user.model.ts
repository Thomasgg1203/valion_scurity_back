export class User {
  id: string;
  email: string;
  password: string;
  roleId?: string;
  roleName?: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
