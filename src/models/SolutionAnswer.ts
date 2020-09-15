import {
    Sequelize,
    DataTypes,
    Model,

    Association,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    HasOneCreateAssociationMixin,
} from 'sequelize';

import { Solution } from './Solution';
import { Question } from './Question';

export interface SolutionAnswerAttributes {
    id?: number;
    solutionId?: number;
    questionId: number;
    answered: number;
}

export class SolutionAnswer extends Model<SolutionAnswerAttributes> implements SolutionAnswerAttributes {
    public id!: number;
    public solutionId!: number;
    public questionId!: number;
    public answered!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getSolution!: BelongsToGetAssociationMixin<Solution>;
    public setSolution!: BelongsToSetAssociationMixin<Solution, number>;
    public createSolution!: BelongsToCreateAssociationMixin<Solution>;

    public getQuestion!: HasOneGetAssociationMixin<Question>;
    public setQuestion!: HasOneSetAssociationMixin<Question, number>;
    public createQuestion!: HasOneCreateAssociationMixin<Question>;

    public readonly solution?: Solution;
    public readonly question?: Question;

    public static associations: {
        solution: Association<SolutionAnswer, Solution>;
        question: Association<SolutionAnswer, Question>;
    }

    public static associate = () => {
        SolutionAnswer.belongsTo(Solution, {
            foreignKey: 'solutionId',
            as: 'solution',
        });

        SolutionAnswer.hasOne(Question, {
            foreignKey: 'questionId',
            as: 'question',
        });
    }
};

export const initSolutionAnswer = (sequelize: Sequelize) => {
    SolutionAnswer.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            solutionId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            questionId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            answered: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'solution_answers',
        }
    )
}