import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Role extends Model {
  public readonly role_id!: string;
  public role_name!: string;
}

Role.init(
  {
    role_id: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

export default Role;
