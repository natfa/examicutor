interface Account {
  id: string | undefined;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
}

export default Account;
