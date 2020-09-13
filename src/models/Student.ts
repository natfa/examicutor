import { SpecialtyOld } from './Specialty';

export interface StudentOld {
  id: string;
  email: string;
  specialty: SpecialtyOld;
}

import {
  Sequelize,
  Model,
  DataTypes,

  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  Association,
} from 'sequelize';

import { User } from './User';
import { Specialty } from './Specialty';

export interface StudentAttributes {
  id?: number;
  userId: number;
  studiesIn: number;
};

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

  public readonly user?: User;
  public readonly specialty?: Specialty;

  public static associations: {
    user: Association<Student, User>;
    specialty: Association<Student, Specialty>;
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