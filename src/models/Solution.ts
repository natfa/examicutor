import {
    Sequelize,
    DataTypes,
    Model,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
    Association,
} from 'sequelize';

import { Exam } from './Exam';
import { Student } from './Student';

export interface SolutionAttributes {
    id?: number;
    examId: number;
    studentId: number;
    grade?: number;
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

    public readonly exam?: Exam;
    public readonly student?: Student;

    public static associations: {
        exam: Association<Solution, Exam>;
        student: Association<Solution, Student>;
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