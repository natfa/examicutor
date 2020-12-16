import {
  Sequelize,
  Model,
  DataTypes,

  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Association,
} from 'sequelize';

import { Module, ModuleAttributes } from './Module';
import { Question, QuestionAttributes } from './Question';

export interface ThemeAttributes {
  id?: number;
  moduleId?: number;
  name: string;
  questions?: QuestionAttributes[];
  module?: ModuleAttributes;
};

export class Theme extends Model<ThemeAttributes> implements ThemeAttributes {
  public id!: number;
  public moduleId!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getModule!: HasOneGetAssociationMixin<Module>;
  public setModule!: HasOneSetAssociationMixin<Module, number>;
  public createModule!: HasOneCreateAssociationMixin<Module>;

  public getQuestions!: HasManyGetAssociationsMixin<Question>;
  public countQuestions!: HasManyCountAssociationsMixin;
  public createQuestion!: HasManyCreateAssociationMixin<Question>;

  public readonly module?: Module;
  public readonly questions?: Question[];

  public static associations: {
    module: Association<Theme, Module>;
    questions: Association<Theme, Question>;
  };

  public static associate = () => {
    Theme.belongsTo(Module, {
      foreignKey: 'moduleId',
      as: 'module',
    });

    Theme.hasMany(Question, {
      foreignKey: 'themeId',
      as: 'questions',
    });
  }
}

export const initTheme = (sequelize: Sequelize) => {
  Theme.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      moduleId: {
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