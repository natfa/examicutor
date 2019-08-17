class Account {
  id: String | null;
  facultyNumber: String;
  email: String;
  passwordHash: String;

  constructor(
    id: String | null = null,
    facultyNumber: String,
    email: String,
    passwordHash: String,
  ) {
    this.id = id;
    this.facultyNumber = facultyNumber;
    this.email = email;
    this.passwordHash = passwordHash;
  }
}

export default Account;
