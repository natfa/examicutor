import {
  Sequelize,
  Model,
  DataTypes,

  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
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

import { User, UserSchema } from './User';
import { Specialty, SpecialtySchema } from './Specialty';
import { Solution } from './Solution';
import Joi from 'joi';

export interface StudentAttributes {
  id?: number;
  userId: number;
  studiesIn: number;
};

export const StudentSchema = Joi.object({
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

  public readonly user?: User;
  public readonly specialty?: Specialty;
  public readonly solutions?: Solution[];

  public static associations: {
    user: Association<Student, User>;
    specialty: Association<Student, Specialty>;
    solutions: Association<Student, Solution>;
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

    Student.hasMany(Solution, {
      foreignKey: 'studentId',
      as: 'solutions',
    })
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