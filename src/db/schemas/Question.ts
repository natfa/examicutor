import mongoose from 'mongoose';

export interface IQuestion extends mongoose.Document {
  text: String;
  incorrectAnswers: Array<String>;
  correctAnswers: Array<String>;
  points: Number;
  subject: String;
}

const schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 150,
  },
  incorrectAnswers: {
    type: [String],
    required: true,
  },
  correctAnswers: {
    type: [String],
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model<IQuestion>('question', schema);

export default Question;
