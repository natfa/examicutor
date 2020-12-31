import {
  Sequelize,
  DataTypes,
  Model,
  Association,

  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,

  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';

import { Exam } from './Exam';
import { Student } from './Student';
import { StudentExamQuestion, StudentExamQuestionAttributes } from './StudentExamQuestion';

export interface StudentExamAttributes {
  id?: number;
  examId: number;
  studentId: number;
  grade?: number;
  questions?: StudentExamQuestionAttributes[];
}

export class StudentExam extends Model<StudentExamAttributes> implements StudentExamAttributes {
  public id!: number;
  public examId!: number;
  public studentId!: number;
  public grade!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getExam!: BelongsToGetAssociationMixin<Exam>;
  public setExam!: BelongsToSetAssociationMixin<Exam, number>;
  public createExam!: BelongsToCreateAssociationMixin<Exam>;

  public getStudent!: BelongsToGetAssociationMixin<Student>;
  public setStudent!: BelongsToSetAssociationMixin<Student, number>;
  public createStudent!: BelongsToCreateAssociationMixin<Student>;

  public getQuestions!: HasManyGetAssociationsMixin<StudentExamQuestion>;
  public countQuestions!: HasManyCountAssociationsMixin;
  public hasQuestion!: HasManyHasAssociationMixin<StudentExamQuestion, number>;
  public hasQuestions!: HasManyHasAssociationsMixin<StudentExamQuestion, number>;
  public setQuestions!: HasManySetAssociationsMixin<StudentExamQuestion, number>;
  public addQuestion!: HasManyAddAssociationMixin<StudentExamQuestion, number>;
  public addQuestions!: HasManyAddAssociationsMixin<StudentExamQuestion, number>;
  public removeQuestion!: HasManyRemoveAssociationMixin<StudentExamQuestion, number>;
  public removeQuestions!: HasManyRemoveAssociationsMixin<StudentExamQuestion, number>;
  public createQuestion!: HasManyCreateAssociationMixin<StudentExamQuestion>;

  public readonly exam?: Exam;
  public readonly student?: Student;
  public readonly questions?: StudentExamQuestion[];

  public static associations: {
    exam: Association<StudentExam, Exam>;
    student: Association<StudentExam, Student>;
    questions: Association<StudentExam, StudentExamQuestion>;
  };

  public static associate = () => {
    StudentExam.belongsTo(Exam, {
      foreignKey: 'examId',
      as: 'exam',
    });

    StudentExam.belongsTo(Student, {
      foreignKey: 'studentId',
      as: 'student',
    });

    StudentExam.hasMany(StudentExamQuestion, {
      foreignKey: 'studentExamId',
      as: 'questions',
    })
  };
}

export const initStudentExam = (sequelize: Sequelize) => {
  StudentExam.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
        examId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
        studentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
        grade: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'studentExams',
    }
  )
}