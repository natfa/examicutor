import { SubjectOld } from './Subject';

export interface ThemeOld {
  id?: string;
  name: string;
  subject: SubjectOld;
}

import {
  Sequelize,
  Model,
  Optional,
  DataTypes,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
} from 'sequelize';

import { Subject } from './Subject';

interface ThemeAttributes {
  id: number;
  subjectId: number;
  name: string;
};

interface ThemeCreationAttributes extends Optional<ThemeAttributes, 'id'> {};

export class Theme extends Model<ThemeAttributes, ThemeCreationAttributes> implements ThemeAttributes {
  public id!: number;
  public subjectId!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getSubject!: HasOneGetAssociationMixin<Subject>;
  public setSubject!: HasOneSetAssociationMixin<Subject, number>;
  public createSubject!: HasOneCreateAssociationMixin<Subject>;
}

export const initTheme = (sequelize: Sequelize) => {
  Theme.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      subjectId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      }
    },
    {
      sequelize,
      tableName: 'themes',
    }
  )
}