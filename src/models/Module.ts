import {
  Sequelize,
  Model,
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

import { Theme, ThemeAttributes } from './Theme';

export interface ModuleAttributes {
  id?: number;
  name: string;
  themes?: ThemeAttributes[];
};

export class Module extends Model<ModuleAttributes> implements ModuleAttributes {
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
    themes: Association<Module, Theme>;
  };

  public static associate = () => {
    Module.hasMany(Theme, {
      foreignKey: 'moduleId',
      as: 'themes',
    });
  };
};

export const initModule = (sequelize: Sequelize) => {
  Module.init(
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
      tableName: 'modules',
    }
  )
};