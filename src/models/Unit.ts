import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';

class Unit extends Model {
  public readonly id!: string;
  public unit_code!: string;
  public unit_name!: string;
  public description!: string;
  public price!: number;
}

Unit.init(
  {
    unit_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Unit',
    tableName: 'units',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

export default Unit;
