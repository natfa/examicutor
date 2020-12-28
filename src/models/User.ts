import Joi from 'joi';
import {
    Sequelize,
    DataTypes,
    Model,
    Association,
} from 'sequelize';

import { BaseSchema } from './BaseSchema';
import { Role } from './Role';

export interface UserAttributes {
    id?: number;
    email: string;
    passwordHash: string;
    roleId: number;
};

export const UserSchema = BaseSchema.keys({
    id: Joi
        .number()
        .optional(),

    email: Joi
        .string()
        .required(),

    password: Joi
        .string(),

    repeatPassword: Joi
        .string(),

    passwordHash: Joi
        .string(),
})
    .with('password', 'repeatPassword')
    .xor('password', 'passwordHash');

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public passwordHash!: string;
    public roleId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly role?: Role;

    public static associations: {
        role: Association<User, Role>;
    }

    public static associate = () => {
        User.belongsTo(Role, {
            foreignKey: 'roleId',
            as: 'role',
        });
    }
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
            roleId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: 'users',
        },
    )
}