import { Dayjs } from 'dayjs';
import { TimeOld } from './Time';
import { QuestionOld } from './Question';
import { AccountOld } from './Account';

export interface ExamOld {
  id?: string;
  name: string;
  startDate: Dayjs;
  endDate: Dayjs;
  timeToSolve: TimeOld;
  questions: QuestionOld[];
  creator: AccountOld;
}

import {
  Sequelize,
  Model,
  Optional,
  DataTypes,

  BelongsToManyGetAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  Association,
} from 'sequelize';

import { Question } from './Question';

interface ExamAttributes {
  id: number;
  name: string;
  startDate: Date;
  timeToSolve: number;
  // creator: string;
}

interface ExamCreationAttributes extends Optional<ExamAttributes, 'id'> {};

export class Exam extends Model<ExamAttributes, ExamCreationAttributes> implements ExamAttributes {
  public id!: number;
  public name!: string;
  public startDate!: Date;
  public timeToSolve!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getQuestions!: BelongsToManyGetAssociationsMixin<Question>;
  public countQuestions!: BelongsToManyCountAssociationsMixin;
  public hasQuestion!: BelongsToManyHasAssociationMixin<Question, number>;
  public hasQuestions!: BelongsToManyHasAssociationsMixin<Question, number>;
  public setQuestions!: BelongsToManySetAssociationsMixin<Question, number>;
  public addQuestion!: BelongsToManyAddAssociationMixin<Question, number>;
  public addQuestions!: BelongsToManyAddAssociationsMixin<Question, number>;
  public removeQuestion!: BelongsToManyRemoveAssociationMixin<Question, number>;
  public removeQuestions!: BelongsToManyRemoveAssociationsMixin<Question, number>;
  public createQuestion!: BelongsToManyCreateAssociationMixin<Question>;

  public readonly questions?: Question[];

  public static associations: {
    questions: Association<Exam, Question>;
  };

  public static associate = () => {
    Exam.belongsToMany(Question, {
      through: 'exam_questions',
      as: 'questions',
    });
  }
}

export const initExam = (sequelize: Sequelize) => {
  Exam.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      timeToSolve: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'exams',
    },
  );
};