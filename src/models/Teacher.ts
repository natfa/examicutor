import Joi from 'joi';
import {
  Sequelize,
  Model,
  DataTypes,

  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  Association,
} from 'sequelize';

import { BaseSchema } from './BaseSchema';
import { User, UserSchema } from './User';

export interface TeacherAttributes {
  id?: number;
  userId: number;
}

export const TeacherSchema = BaseSchema.keys({
  id: Joi
    .number()
    .optional(),

  user: UserSchema
    .required(),
});

export class Teacher extends Model<TeacherAttributes> implements TeacherAttributes {
  public id!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, number>;
  public createUser!: BelongsToCreateAssociationMixin<User>;

  public readonly user?: User;

  public static associations: {
    user: Association<Teacher, User>;
  };

  public static associate = () => {
    Teacher.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export const initTeacher = (sequelize: Sequelize) => {
  Teacher.init(
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
      },
    {
      sequelize,
      tableName: 'teachers',
    },
  );
};