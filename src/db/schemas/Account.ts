import mongoose from 'mongoose';

export interface IAccount extends mongoose.Document {
  firstName?: String;
  middleName?: String;
  lastName?: String;
  facultyNumber: String;
  email: String;
  passwordHash: String;
  course?: String;
  accountType?: String;
}

const schema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  course: String,
  accountType: String,
  facultyNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const Account = mongoose.model<IAccount>('account', schema);

export default Account;