import mongoose from 'mongoose';

export interface IAccount extends mongoose.Document {
  facultyNumber: String;
  email: String;
  passwordHash: String;
}

const schema = new mongoose.Schema({
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
