export interface SpecialtyOld {
  id: string;
  name: string;
}

import {
  Sequelize,
  DataTypes,
  Model,
} from 'sequelize';

export interface SpecialtyAttributes {
  id?: number;
  name: string;
}

export class Specialty extends Model<SpecialtyAttributes> implements SpecialtyAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initSpecialty = (sequelize: Sequelize) => {
  Specialty.init(
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
      },
    },
    {
      sequelize,
      tableName: 'specialties',
    },
  );
};