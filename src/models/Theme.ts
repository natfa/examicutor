import Joi from 'joi';
import {
  Sequelize,
  Model,
  DataTypes,

  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,

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

import { BaseSchema } from './BaseSchema';

export const ThemeSchema = BaseSchema.keys({
  id: Joi
    .number()
    .optional(),

  moduleId: Joi
    .number()
    .required(),

  name: Joi
    .string()
    .required(),
});

import { ExamParameter } from './ExamParameter';
import { Module, ModuleAttributes, ModuleSchema } from './Module';
import { Question, QuestionAttributes, QuestionSchema } from './Question';

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
  public hasQuestion!: HasManyHasAssociationMixin<Question, number>;
  public hasQuestions!: HasManyHasAssociationsMixin<Question, number>;
  public setQuestions!: HasManySetAssociationsMixin<Question, number>;
  public addQuestion!: HasManyAddAssociationMixin<Question, number>;
  public addQuestions!: HasManyAddAssociationsMixin<Question, number>;
  public removeQuestion!: HasManyRemoveAssociationMixin<Question, number>;
  public removeQuestions!: HasManyRemoveAssociationsMixin<Question, number>;
  public createQuestion!: HasManyCreateAssociationMixin<Question>;

  public getThemes!: HasManyGetAssociationsMixin<Theme>;
  public countThemes!: HasManyCountAssociationsMixin;
  public hasTheme!: HasManyHasAssociationMixin<Theme, number>;
  public hasThemes!: HasManyHasAssociationsMixin<Theme, number>;
  public setThemes!: HasManySetAssociationsMixin<Theme, number>;
  public addTheme!: HasManyAddAssociationMixin<Theme, number>;
  public addThemes!: HasManyAddAssociationsMixin<Theme, number>;
  public removeTheme!: HasManyRemoveAssociationMixin<Theme, number>;
  public removeThemes!: HasManyRemoveAssociationsMixin<Theme, number>;
  public createTheme!: HasManyCreateAssociationMixin<Theme>;

  public readonly module?: Module;
  public readonly questions?: Question[];
  public readonly examParameters?: ExamParameter[];

  public static associations: {
    module: Association<Theme, Module>;
    questions: Association<Theme, Question>;
    examParameters: Association<Theme, ExamParameter>;
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

    Theme.hasMany(ExamParameter, {
      foreignKey: 'themeId',
      as: 'examParameters',
    })
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
        unique: false,
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