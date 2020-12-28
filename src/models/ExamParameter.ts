import Joi from 'joi';
import {
    Sequelize,
    Model,
    DataTypes,
    Association,

    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
} from 'sequelize';

import { BaseSchema } from './BaseSchema';
import { ThemeSchema } from './Theme';

export const ExamParameterSchema = BaseSchema.keys({
    id: Joi
        .number()
        .optional(),

    theme: ThemeSchema
        .required(),

    count: Joi
        .number()
        .required(),
});

import { Exam } from './Exam';
import { Theme } from './Theme';

export interface ExamParameterAttributes {
    id?: number;
    themeId: number;
    examId?: number;
    count: number;
}

export class ExamParameter extends Model<ExamParameterAttributes> implements ExamParameterAttributes {
    public id!: number;
    public themeId!: number;
    public examId!: number;
    public count!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getTheme!: BelongsToGetAssociationMixin<Theme>;
    public setTheme!: BelongsToSetAssociationMixin<number, Theme>;
    public createTheme!: BelongsToCreateAssociationMixin<Theme>;

    public getExam!: BelongsToGetAssociationMixin<Exam>;
    public setExam!: BelongsToSetAssociationMixin<number, Exam>;
    public createExam!: BelongsToCreateAssociationMixin<Exam>;

    public readonly theme?: Theme;
    public readonly exam?: Exam;

    public static associations: {
        theme: Association<ExamParameter, Theme>;
        exam: Association<ExamParameter, Exam>;
    }

    public static associate = () => {
        ExamParameter.belongsTo(Theme, {
            foreignKey: 'themeId',
            as: 'theme',
        });

        ExamParameter.belongsTo(Exam, {
            foreignKey: 'examId',
            as: 'exam',
        });
    }
}

export const initExamParameter = (sequelize: Sequelize) => {
    ExamParameter.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            themeId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            examId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            count: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'examParameters',
        },
    )
}