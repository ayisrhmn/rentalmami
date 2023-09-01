import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config';
import SalesHeader from './SalesHeader';
import Unit from './Unit';

class SalesDetail extends Model {
  public readonly id!: string;
  public qty!: number;
  public sales_price!: number;
  public total!: number;
  public is_returned!: boolean;
  public sales_headers!: string;
  public units!: string;
}

SalesDetail.init(
  {
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sales_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_returned: {
      type: DataTypes.BOOLEAN,
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
    modelName: 'SalesDetail',
    tableName: 'sales_details',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
);

SalesDetail.belongsTo(Unit, { foreignKey: 'units', as: 'detail_unit' });

export default SalesDetail;
