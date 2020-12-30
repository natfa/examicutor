import Joi from 'joi';
import {
  Sequelize,
  Model,
  DataTypes,
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

import { User, UserSchema } from './User';
import { Specialty, SpecialtySchema } from './Specialty';
import { BaseSchema } from './BaseSchema';
import { StudentExam } from './StudentExam';

export interface StudentAttributes {
  id?: number;
  userId: number;
  studiesIn: number;
};

export const StudentSchema = BaseSchema.keys({
  id: Joi
    .number()
    .optional(),

  user: UserSchema
    .required(),

  specialty: SpecialtySchema
    .required(),
});

export class Student extends Model<StudentAttributes> implements StudentAttributes {
  public id!: number;
  public userId!: number;
  public studiesIn!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, number>;
  public createUser!: BelongsToCreateAssociationMixin<User>;

  public getSpecialty!: BelongsToGetAssociationMixin<Specialty>;
  public setSpecialty!: BelongsToSetAssociationMixin<Specialty, number>;
  public createSpecialty!: BelongsToCreateAssociationMixin<Specialty>;

  public getExams!: HasManyGetAssociationsMixin<StudentExam>;
  public countExams!: HasManyCountAssociationsMixin;
  public hasExam!: HasManyHasAssociationMixin<StudentExam, number>;
  public hasExams!: HasManyHasAssociationsMixin<StudentExam, number>;
  public setExams!: HasManySetAssociationsMixin<StudentExam, number>;
  public addExam!: HasManyAddAssociationMixin<StudentExam, number>;
  public addExams!: HasManyAddAssociationsMixin<StudentExam, number>;
  public removeExam!: HasManyRemoveAssociationMixin<StudentExam, number>;
  public removeExams!: HasManyRemoveAssociationsMixin<StudentExam, number>;
  public createExam!: HasManyCreateAssociationMixin<StudentExam>;

  public readonly user?: User;
  public readonly specialty?: Specialty;
  public readonly exams?: StudentExam[];

  public static associations: {
    user: Association<Student, User>;
    specialty: Association<Student, Specialty>;
    exams: Association<Student, StudentExam>;
  }

  public static associate = () => {
    Student.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Student.belongsTo(Specialty, {
      foreignKey: 'studiesIn',
      as: 'specialty',
    });

    Student.hasMany(StudentExam, {
      foreignKey: 'studentId',
      as: 'exams',
    });
  }
}

export const initStudent = (sequelize: Sequelize) => {
  Student.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      studiesIn: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'students',
    },
  );
};