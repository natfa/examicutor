import QuestionSchema, { IQuestion } from './schemas/Question';
import QuestionModel from '../models/Question';

const schemaToModel = (schema: IQuestion): QuestionModel => {
  return new QuestionModel(
    schema.id,
    schema.text,
    schema.incorrectAnswers,
    schema.correctAnswers,
    schema.points,
  );
}

const getAllQuestions = (): Promise<Array<QuestionModel>> => {
  return new Promise<Array<QuestionModel>>((resolve, reject) => {
    QuestionSchema.find()
      .then((schemas) => {
        const models = schemas.map((schema) => schemaToModel(schema));

        return resolve(models);
      })
      .catch((err) => reject(err));
  });
}

const getQuestionById = (questionId: String): Promise<QuestionModel | null> => {
  return new Promise<QuestionModel | null>((resolve, reject) => {
    QuestionSchema.findById(questionId)
      .then((schema) => {
        if (schema === null || schema === undefined)
          return resolve(null);
        return resolve(schemaToModel(schema));
      })
      .catch((err) => reject(err));
  })
}

const saveQuestion = (question: QuestionModel): Promise<QuestionModel> => {
  const questionSchema = new QuestionSchema({
    text: question.text,
    incorrectAnswers: question.incorrectAnswers,
    correctAnswers: question.correctAnswers,
    points: question.points,
  });

  return new Promise<QuestionModel>((resolve, reject) => {
    questionSchema.save()
      .then((schema) => resolve(schemaToModel(schema)))
      .catch((err) => reject(err));
  })
}

const updateQuestionById = (questionId: String, newQuestion: QuestionModel): Promise<QuestionModel | null> => {
  const update = {
    $set: {
      text: newQuestion.text,
      incorrectAnswers: newQuestion.incorrectAnswers,
      correctAnswers: newQuestion.correctAnswers,
      points: newQuestion.points,

    }
  };

  return new Promise<QuestionModel | null>((resolve, reject) => {
    QuestionSchema.findByIdAndUpdate(questionId, update)
      .then((oldSchema) => {
        if (oldSchema === null || oldSchema === undefined)
          return resolve(null);
        return resolve(schemaToModel(oldSchema));
      })
      .catch((err) => reject(err));
  });
}

const removeQuestionById = (questionId: String): Promise<QuestionModel | null> => {
  return new Promise<QuestionModel | null>((resolve, reject) => {
    QuestionSchema.findByIdAndRemove(questionId)
      .then((schema) => {
        if (schema === null || schema === undefined)
          return resolve(null);
        return resolve(schemaToModel(schema));
      })
      .catch((err) => reject(err));
  });
}

export default {
  getAllQuestions,
  getQuestionById,
  saveQuestion,
  updateQuestionById,
  removeQuestionById,
}

