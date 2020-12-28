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

import { ExamParameter, ExamParameterAttributes } from './ExamParameter';
import { Solution } from './Solution';

interface ExamAttributes {
  id?: number;
  name: string;
  startDate: Date;
  timeToSolve: number;
  parameters?: ExamParameterAttributes[];
  // creator: string;
}

export class Exam extends Model<ExamAttributes> implements ExamAttributes {
  public id!: number;
  public name!: string;
  public startDate!: Date;
  public timeToSolve!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getSolutions!: HasManyGetAssociationsMixin<Solution>;
  public countSolutions!: HasManyCountAssociationsMixin;
  public hasSolution!: HasManyHasAssociationMixin<Solution, number>;
  public hasSolutions!: HasManyHasAssociationsMixin<Solution, number>;
  public setSolutions!: HasManySetAssociationsMixin<Solution, number>;
  public addSolution!: HasManyAddAssociationMixin<Solution, number>;
  public addSolutions!: HasManyAddAssociationsMixin<Solution, number>;
  public removeSolution!: HasManyRemoveAssociationMixin<Solution, number>;
  public removeSolutions!: HasManyRemoveAssociationsMixin<Solution, number>;
  public createSolution!: HasManyCreateAssociationMixin<Solution>;

  public getExamParameters!: HasManyGetAssociationsMixin<ExamParameter>;
  public countExamParameters!: HasManyCountAssociationsMixin;
  public hasExamParameter!: HasManyHasAssociationMixin<ExamParameter, number>;
  public hasExamParameters!: HasManyHasAssociationsMixin<ExamParameter, number>;
  public setExamParameters!: HasManySetAssociationsMixin<ExamParameter, number>;
  public addExamParameter!: HasManyAddAssociationMixin<ExamParameter, number>;
  public addExamParameters!: HasManyAddAssociationsMixin<ExamParameter, number>;
  public removeExamParameter!: HasManyRemoveAssociationMixin<ExamParameter, number>;
  public removeExamParameters!: HasManyRemoveAssociationsMixin<ExamParameter, number>;
  public createExamParameter!: HasManyCreateAssociationMixin<ExamParameter>;

  public readonly solutions?: Solution[];
  public readonly parameters?: ExamParameter[];

  public static associations: {
    solutions: Association<Exam, Solution>;
    parameters: Association<Exam, ExamParameter>;
  };

  public static associate = () => {
    Exam.hasMany(Solution, {
      foreignKey: 'examId',
      as: 'solutions',
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