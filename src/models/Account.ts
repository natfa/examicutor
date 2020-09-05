export interface AccountOld {
  id?: string;
  email: string;
  passwordHash: string;
  roles: ('teacher'|'student'|'admin')[];
}
