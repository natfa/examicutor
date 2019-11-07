class Account {
  id: string|null|undefined;

  email: string;

  passwordHash: string;

  isAdmin: boolean;

  constructor(
    id: string|null|undefined,
    email: string,
    passwordHash: string,
    isAdmin: boolean,
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.isAdmin = isAdmin;
  }
}

export default Account;
