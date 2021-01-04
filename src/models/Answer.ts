import Joi from 'joi';
import {
  Sequelize,
  Model,
  DataTypes,
} from 'sequelize';

import { BaseSchema } from './BaseSchema';
import { Question } from './Question';
import { StudentExamQuestion } from './StudentExamQuestion';

export interface AnswerAttributes {
  id?: number;
  questionId?: number;
  text: string;
  correct: boolean;
}

/**
 * The schema that should be accepted from requests
 */
export const AnswerSchema = BaseSchema.keys({
  id: Joi
    .number()
    .optional(),

  text: Joi
    .string()
    .required(),

  correct: Joi
    .boolean()
    .required(),
});

export class Answer extends Model<AnswerAttributes> implements AnswerAttributes {
  public id!: number;
  public questionId!: number;
  public text!: string;
  public correct!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static assocate = () => {
    Answer.belongsTo(Question, {
      foreignKey: 'questionId',
    });

    Answer.hasMany(StudentExamQuestion, {
      foreignKey: 'givenAnswerId',
      as: 'studentExamQuestions',
    })
  }
}

export const initAnswer = (sequelize: Sequelize) => {
  Answer.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      questionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: 'answers',
    }
  );
};