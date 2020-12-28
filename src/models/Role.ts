import Joi from 'joi';
import {
    Sequelize,
    DataTypes,
    Model,
    Association,
    HasManyGetAssociationsMixin,
    HasManyCountAssociationsMixin
} from 'sequelize';

import { BaseSchema } from './BaseSchema';
import { User } from './User';

export interface RoleAttributes {
    id?: number;
    name: string;
};

export const RoleSchema = BaseSchema.keys({
    id: Joi
        .number()
        .optional(),

    name: Joi
        .string()
        .required(),
});

export class Role extends Model<RoleAttributes> implements RoleAttributes {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly users?: User[];

    public getUsers!: HasManyGetAssociationsMixin<User>;
    public countUsers!: HasManyCountAssociationsMixin;

    public static associations: {
        users: Association<Role, User>;
    }

    public static associate = () => {
        Role.hasMany(User, {
            foreignKey: 'roleId',
            as: 'users',
        });
    }
}

export const initRole = (sequelize: Sequelize) => {
    Role.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(128),
                allowNull: false,
                unique: true,
            }
        },
        {
            sequelize,
            tableName: 'roles',
        },
    );
};