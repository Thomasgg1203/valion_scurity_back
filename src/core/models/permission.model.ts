export class Permission {
  id: string;
  action: string;
  subject: string;

  constructor(partial: Partial<Permission>) {
    Object.assign(this, partial);
  }
}
