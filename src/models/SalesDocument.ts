import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import SalesHeader from './SalesHeader';

class SalesDocument extends Model {
  public readonly id!: string;
  public type!: string;
  public filename!: string;
  public sales_headers!: string;
}

SalesDocument.init(
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sales_headers: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: SalesHeader,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'SalesDocument',
    tableName: 'sales_documents',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

export default SalesDocument;
