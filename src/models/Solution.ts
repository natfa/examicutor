import {
    Sequelize,
    DataTypes,
    Model,
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

import { Exam } from './Exam';
import { Student } from './Student';
import { SolutionAnswer, SolutionAnswerAttributes } from './SolutionAnswer';

export interface SolutionAttributes {
    id?: number;
    examId: number;
    studentId: number;
    grade?: number;
    solutionAnswers?: SolutionAnswerAttributes[];
}

export class Solution extends Model<SolutionAttributes> implements SolutionAttributes {
    public id!: number;
    public examId!: number;
    public studentId!: number;
    public grade!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getExam!: BelongsToGetAssociationMixin<Exam>;
    public setExam!: BelongsToSetAssociationMixin<Exam, number>;
    public createExam!: BelongsToCreateAssociationMixin<Exam>;

    public getStudent!: BelongsToGetAssociationMixin<Student>;
    public setStudent!: BelongsToSetAssociationMixin<Student, number>;
    public createStudent!: BelongsToCreateAssociationMixin<Student>;

    public getSolutionAnswers!: HasManyGetAssociationsMixin<SolutionAnswer>;
    public countSolutions!: HasManyCountAssociationsMixin;
    public hasSolutionAnswer!: HasManyHasAssociationMixin<SolutionAnswer, number>;
    public hasSolutionAnswers!: HasManyHasAssociationsMixin<SolutionAnswer, number>;
    public setSolutionAnswers!: HasManySetAssociationsMixin<SolutionAnswer, number>;
    public addSolutionAnswer!: HasManyAddAssociationMixin<SolutionAnswer, number>;
    public addSolutionAnswers!: HasManyAddAssociationsMixin<SolutionAnswer, number>;
    public removeSolutionAnswer!: HasManyRemoveAssociationMixin<SolutionAnswer, number>;
    public removeSolutionAnswers!: HasManyRemoveAssociationsMixin<SolutionAnswer, number>;
    public createSolutionAnswer!: HasManyCreateAssociationMixin<SolutionAnswer>;

    public readonly exam?: Exam;
    public readonly student?: Student;
    public readonly solutionAnswers?: SolutionAnswer[];

    public static associations: {
        exam: Association<Solution, Exam>;
        student: Association<Solution, Student>;
        solutionAnswers: Association<Solution, SolutionAnswer>;
    };

    public static associate = () => {
        Solution.belongsTo(Exam, {
            foreignKey: 'examId',
            as: 'exam',
        });

        Solution.belongsTo(Student, {
            foreignKey: 'studentId',
            as: 'student',
        });

        Solution.hasMany(SolutionAnswer, {
            foreignKey: 'solutionId',
            as: 'solutionAnswers',
        });
    };
}

export const initSolution = (sequelize: Sequelize) => {
    Solution.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            examId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            studentId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            grade: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'solutions',
        }
    )
}