import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';
import PurchaseDetail from './PurchaseDetail';

class PurchaseHeader extends Model {
  public readonly id!: string;
  public trx_code!: string;
  public supplier!: string;
  public supplier_address!: string;
  public trx_date!: Date;
  public trx_due_date!: Date;
  public paid_off!: boolean;
  public grand_total!: number;
}

PurchaseHeader.init(
  {
    trx_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supplier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supplier_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trx_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    trx_due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paid_off: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    grand_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PurchaseHeader',
    tableName: 'purchase_headers',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

PurchaseHeader.hasMany(PurchaseDetail, {
  foreignKey: 'purchase_headers',
  as: 'details',
});

export default PurchaseHeader;
