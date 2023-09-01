import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';
import SalesDetail from './SalesDetail';
import SalesDocument from './SalesDocument';

class SalesHeader extends Model {
  public readonly id!: string;
  public trx_code!: string;
  public customer!: string;
  public customer_address!: string;
  public trx_date!: Date;
  public trx_due_date!: Date;
  public no_days!: number;
  public is_service!: boolean;
  public notes!: string;
  public grand_total!: number;
}

SalesHeader.init(
  {
    trx_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trx_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    trx_due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    no_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_service: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grand_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SalesHeader',
    tableName: 'sales_headers',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

SalesHeader.hasMany(SalesDetail, {
  foreignKey: 'sales_headers',
  as: 'details',
});

SalesHeader.hasMany(SalesDocument, {
  foreignKey: 'sales_headers',
  as: 'documents',
});

export default SalesHeader;
