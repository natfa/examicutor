import { AnswerOld } from './Answer';
import { SubjectOld } from './Subject';
import { ThemeOld } from './Theme';

export interface QuestionOld {
  id?: string;
  text: string;
  points: number;
  subject: SubjectOld;
  theme: ThemeOld;
  answers: Array<AnswerOld>;
}

import {
  Sequelize,
  Model,
  DataTypes,

  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  Association,
} from 'sequelize';

import { Answer, AnswerAttributes } from './Answer';

export interface QuestionAttributes {
  id?: number;
  text: string;
  points: number;
  answers?: AnswerAttributes[];
};

export class Question extends Model<QuestionAttributes> implements QuestionAttributes {
  public id!: number;
  public text!: string;
  public points!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getAnswers!: HasManyGetAssociationsMixin<Answer>;
  public countAnswers!: HasManyCountAssociationsMixin;
  public setAnswers!: HasManySetAssociationsMixin<Answer, number>;
  public addAnswer!: HasManyAddAssociationMixin<Answer, number>;
  public createAnswer!: HasManyCreateAssociationMixin<Answer>;

  public readonly answers?: Answer[];

  public static associations: {
    answers: Association<Question, Answer>;
  };
};

export const initQuestion = (sequelize: Sequelize) => {
  Question.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'questions',
    },
  );
};