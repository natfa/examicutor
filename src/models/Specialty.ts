import Joi from 'joi';
import {
  Sequelize,
  DataTypes,
  Model,

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
  Association,
} from 'sequelize';

import { Student } from './Student';

export interface SpecialtyAttributes {
  id?: number;
  name: string;
}

export const SpecialtySchema = Joi.object({
  id: Joi
    .number()
    .optional(),

  name: Joi
    .string()
    .required(),
});

export class Specialty extends Model<SpecialtyAttributes> implements SpecialtyAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getStudents!: HasManyGetAssociationsMixin<Student>;
  public countStudents!: HasManyCountAssociationsMixin;
  public hasStudent!: HasManyHasAssociationMixin<Student, number>;
  public hasStudents!: HasManyHasAssociationsMixin<Student, number>;
  public setStudents!: HasManySetAssociationsMixin<Student, number>;
  public addStudent!: HasManyAddAssociationMixin<Student, number>;
  public addStudents!: HasManyAddAssociationsMixin<Student, number>;
  public removeStudent!: HasManyRemoveAssociationMixin<Student, number>;
  public removeStudents!: HasManyRemoveAssociationsMixin<Student, number>;
  public createStudent!: HasManyCreateAssociationMixin<Student>;

  public readonly students?: Student[];

  public static associations: {
    students: Association<Specialty, Student>;
  };

  public static associate = () => {
    Specialty.hasMany(Student, {
      foreignKey: 'studiesIn',
      as: 'students',
    });
  }
}

export const initSpecialty = (sequelize: Sequelize) => {
  Specialty.init(
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
    },
    {
      sequelize,
      tableName: 'specialties',
    },
  );
};