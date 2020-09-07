export interface AnswerOld {
  id?: string;
  text: string;
  correct: boolean;
}

import {
  Sequelize,
  Model,
  Optional,
  DataTypes,
} from 'sequelize';

interface AnswerAttributes {
  id: number;
  questionId: number;
  text: string;
  correct: boolean;
}

interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {};

export class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  public id!: number;
  public questionId!: number;
  public text!: string;
  public correct!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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