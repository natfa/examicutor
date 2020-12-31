import {
  Sequelize,
  DataTypes,
  Model,

  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
} from 'sequelize';

import { StudentExam } from './StudentExam';
import { Question } from './Question';
import { Answer } from './Answer';

export interface StudentExamQuestionAttributes {
  id?: number;
  studentExamId?: number;
  questionId: number;
  givenAnswerId?: number;
}

export class StudentExamQuestion extends Model<StudentExamQuestionAttributes> implements StudentExamQuestionAttributes {
  public id!: number;
  public studentExamId!: number;
  public questionId!: number;
  public givenAnswerId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getExam!: BelongsToGetAssociationMixin<StudentExam>;
  public setExam!: BelongsToSetAssociationMixin<StudentExam, number>;
  public createExam!: BelongsToCreateAssociationMixin<StudentExam>;

  public getQuestion!: HasOneGetAssociationMixin<Question>;
  public setQuestion!: HasOneSetAssociationMixin<Question, number>;
  public createQuestion!: HasOneCreateAssociationMixin<Question>;

  public getGivenAnswer!: HasOneGetAssociationMixin<Answer>;
  public setGivenAnswer!: HasOneSetAssociationMixin<Answer, number>;
  public createGivenAnswer!: HasOneCreateAssociationMixin<Answer>;

  public readonly exam?: StudentExam;
  public readonly question?: Question;
  public readonly givenAnswer?: Answer;

  public static associations: {
    exam: Association<StudentExamQuestion, StudentExam>;
    question: Association<StudentExamQuestion, Question>;
    givenAnswer: Association<StudentExamQuestion, Answer>;
  }

  public static associate = () => {
    StudentExamQuestion.belongsTo(StudentExam, {
      foreignKey: 'studentExamId',
      as: 'exam',
    });

    StudentExamQuestion.hasOne(Question, {
      foreignKey: 'questionId',
      as: 'question',
    });

    StudentExamQuestion.hasOne(Answer, {
      foreignKey: 'givenAnswerId',
      as: 'givenAnswer',
    })
  }
};

export const initStudentExamQuestion = (sequelize: Sequelize) => {
  StudentExamQuestion.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      studentExamId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      givenAnswerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'studentExamQuestions',
    }
  )
};