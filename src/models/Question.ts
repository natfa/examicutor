import Joi from 'joi';
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
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from 'sequelize';

import { Answer, AnswerAttributes, AnswerSchema } from './Answer';
import { Theme, ThemeAttributes } from './Theme';
import { Exam } from './Exam';

export interface QuestionAttributes {
  id?: number;
  text: string;
  points: number;
  answers?: AnswerAttributes[];

  theme?: ThemeAttributes;
  themeId?: number;
};

/**
 * The schema that should be accepted from requests
 */
export const QuestionSchema = Joi.object({
  id: Joi
    .number()
    .optional(),

  text: Joi
    .string()
    .required(),

  points: Joi
    .number()
    .required(),

  answers: Joi
    .array()
    .items(AnswerSchema)
    .required(),
});

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

  public getTheme!: BelongsToGetAssociationMixin<Theme>;
  public setTheme!: BelongsToSetAssociationMixin<Theme, number>;
  public createTheme!: BelongsToCreateAssociationMixin<Theme>;

  public readonly theme?: Theme;
  public readonly answers?: Answer[];

  public static associations: {
    theme: Association<Question, Theme>;
    answers: Association<Question, Answer>;
  };

  public static associate = () => {
    Question.hasMany(Answer, {
      foreignKey: 'questionId',
      as: 'answers',
    });

    Question.belongsTo(Theme, {
      foreignKey: 'themeId',
      as: 'theme',
    });

    Question.belongsToMany(Exam, {
      through: 'exam_questions',
    });
  }
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