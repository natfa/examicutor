import {
  Sequelize,
  Model,
  DataTypes,
} from 'sequelize';

import { Question } from './Question';

export interface AnswerAttributes {
  id?: number;
  questionId?: number;
  text: string;
  correct: boolean;
}

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