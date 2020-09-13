import {
    Sequelize,
    DataTypes,
    Model,
} from 'sequelize';

export interface UserAttributes {
    id?: number;
    email: string;
    passwordHash: string;
};

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public passwordHash!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initUser = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(128),
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            passwordHash: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'users',
        },
    )
}