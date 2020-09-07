export interface SubjectOld {
  id?: string;
  name: string;
}

import {
  Sequelize,
  Model,
  Optional,
  DataTypes,

  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyCreateAssociationMixin,
  Association,
} from 'sequelize';

import { Theme } from './Theme';

interface SubjectAttributes {
  id: number;
  name: string;
};

interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id'> {};

export class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getThemes!: HasManyGetAssociationsMixin<Theme>;
  public countThemes!: HasManyCountAssociationsMixin;
  public hasTheme!: HasManyHasAssociationMixin<Theme, number>;
  public setThemes!: HasManySetAssociationsMixin<Theme, number>;
  public addTheme!: HasManyAddAssociationMixin<Theme, number>;
  public removeTheme!: HasManyRemoveAssociationMixin<Theme, number>;
  public createTheme!: HasManyCreateAssociationMixin<Theme>;

  public readonly themes?: Theme[];

  public static associations: {
    themes: Association<Subject, Theme>;
  };
};

export const initSubject = (sequelize: Sequelize) => {
  Subject.init(
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
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      tableName: 'subjects',
    }
  )
};