import Joi from 'joi';
import {
  Sequelize,
  Model,
  DataTypes,
  Association,

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

import { BaseSchema } from './BaseSchema';
import { ExamParameter, ExamParameterAttributes, ExamParameterSchema } from './ExamParameter';
import { StudentExam } from './StudentExam';

export const ExamSchema = BaseSchema.keys({
  id: Joi
    .number()
    .optional(),

  name: Joi
    .string()
    .required(),

  startDate: Joi
    .date()
    .greater('now')
    .required(),

  timeToSolve: Joi
    .number()
    .required(),

  parameters: Joi
    .array()
    .items(ExamParameterSchema)
    .required(),
});

interface ExamAttributes {
  id?: number;
  name: string;
  startDate: Date;
  timeToSolve: number; // in seconds
  parameters?: ExamParameterAttributes[];
  // creator: string;
}

export class Exam extends Model<ExamAttributes> implements ExamAttributes {
  public id!: number;
  public name!: string;
  public startDate!: Date;
  public timeToSolve!: number; // in seconds

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getStudentExams!: HasManyGetAssociationsMixin<StudentExam>;
  public countStudentExams!: HasManyCountAssociationsMixin;
  public hasStudentExam!: HasManyHasAssociationMixin<StudentExam, number>;
  public hasStudentExams!: HasManyHasAssociationsMixin<StudentExam, number>;
  public setStudentExams!: HasManySetAssociationsMixin<StudentExam, number>;
  public addStudentExam!: HasManyAddAssociationMixin<StudentExam, number>;
  public addStudentExams!: HasManyAddAssociationsMixin<StudentExam, number>;
  public removeStudentExam!: HasManyRemoveAssociationMixin<StudentExam, number>;
  public removeStudentExams!: HasManyRemoveAssociationsMixin<StudentExam, number>;
  public createStudentExam!: HasManyCreateAssociationMixin<StudentExam>;

  // Remember that an alias of the relation name defines
  // the names of association mixins.
  // sequelize.org - If an alias was defined, it will be used instead of the model name to form the method names.
  public getParameters!: HasManyGetAssociationsMixin<ExamParameter>;
  public countParameters!: HasManyCountAssociationsMixin;
  public hasParameter!: HasManyHasAssociationMixin<ExamParameter, number>;
  public hasParameters!: HasManyHasAssociationsMixin<ExamParameter, number>;
  public setParameters!: HasManySetAssociationsMixin<ExamParameter, number>;
  public addParameter!: HasManyAddAssociationMixin<ExamParameter, number>;
  public addParameters!: HasManyAddAssociationsMixin<ExamParameter, number>;
  public removeParameter!: HasManyRemoveAssociationMixin<ExamParameter, number>;
  public removeParameters!: HasManyRemoveAssociationsMixin<ExamParameter, number>;
  public createParameter!: HasManyCreateAssociationMixin<ExamParameter>;

  public readonly studentExams?: StudentExam[];
  public readonly parameters?: ExamParameter[];

  public static associations: {
    studentExams: Association<Exam, StudentExam>;
    parameters: Association<Exam, ExamParameter>;
  };

  public static associate = () => {
    Exam.hasMany(StudentExam, {
      foreignKey: 'examId',
      as: 'studentExams',
    });

    Exam.hasMany(ExamParameter, {
      foreignKey: 'examId',
      as: 'parameters',
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
        //unique: true,
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