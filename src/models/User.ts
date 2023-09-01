import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';
import Role from './Role';

class User extends Model {
  public readonly login_id!: string;
  public display_name!: string;
  public email!: string;
  public password!: string;
  public is_active!: boolean;
  public roles!: string;
}

User.init(
  {
    login_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    roles: {
      type: DataTypes.ENUM('developer', 'super-admin', 'admin'),
      allowNull: false,
      references: {
        model: Role,
        key: 'role_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

// User.hasOne(Role);

export default User;
