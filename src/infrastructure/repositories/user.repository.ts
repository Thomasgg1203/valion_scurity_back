import { User } from 'src/core/models/user.model';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  assignRole(userId: string, roleId: string): Promise<void>;
  findUserWithPermissions(userId: string): Promise<{
    id: string;
    email: string;
    roleId: string | null;
    roleName: string | null;
    permissions: { action: string; subject: string }[];
  } | null>;
}
