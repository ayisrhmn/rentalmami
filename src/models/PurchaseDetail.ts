import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import PurchaseHeader from './PurchaseHeader';
import Unit from './Unit';

class PurchaseDetail extends Model {
  public readonly id!: string;
  public qty!: number;
  public purchase_price!: number;
  public total!: number;
  public purchase_headers!: string;
  public units!: string;
}

PurchaseDetail.init(
  {
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchase_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchase_headers: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: PurchaseHeader,
        key: 'id',
      },
    },
    units: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Unit,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'PurchaseDetail',
    tableName: 'purchase_details',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

PurchaseDetail.belongsTo(Unit, { foreignKey: 'units', as: 'detail_unit' });

export default PurchaseDetail;
