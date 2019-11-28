export interface Account {
  id?: string;
  email: string;
  passwordHash: string;
  roles: ('teacher'|'student'|'admin')[];
}
