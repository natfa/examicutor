import QuestionSchema, { IQuestion } from './schemas/Question';
import QuestionModel from '../models/Question';

function saveNewQuestion(question: QuestionModel): Promise<IQuestion> {
  const newQuestion = new QuestionSchema({
    text: question.text,
    incorrectAnswers: question.incorrectAnswers,
    correctAnswers: question.correctAnswers,
    points: question.points,
  });

  return newQuestion.save();
}

function findQuestionById(questionID: String): Promise<IQuestion | null> {
  return QuestionSchema.findById(questionID).exec();
}

function getAllQuestions(): Promise<Array<IQuestion>> {
  return QuestionSchema.find().exec();
}

function updateQuestionById(questionID: String, newQuestion: QuestionModel): Promise<IQuestion | null> {
  const update = {
    $set: {
      text: newQuestion.text,
      incorrectAnswers: newQuestion.incorrectAnswers,
      correctAnswers: newQuestion.correctAnswers,
      points: newQuestion.points,
    }
  }

  return QuestionSchema.findByIdAndUpdate(questionID, update).exec();
}

function removeQuestionById(questionID: String): Promise<IQuestion | null> {
  return QuestionSchema.findByIdAndRemove(questionID).exec();
}

export default {
  saveNewQuestion,
  findQuestionById,
  getAllQuestions,
  updateQuestionById,
  removeQuestionById,
}

