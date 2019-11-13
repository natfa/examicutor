export interface Account {
  id?: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
}
