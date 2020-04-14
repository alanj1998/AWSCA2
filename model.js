const {
  Sequelize,
  Model,
  DataTypes
} = require("sequelize");

const sequelize = new Sequelize(
  "mysql://31adVEshxH:ykXbGs3khN@remotemysql.com:3306/31adVEshxH", {
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

class Product extends Model {}
Product.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  status: DataTypes.STRING,
  provider: DataTypes.STRING,
  pricePerUnit: DataTypes.FLOAT,
  code: DataTypes.STRING,
  unitsAvailable: DataTypes.INTEGER,
}, {
  sequelize,
  modelName: "product"
});
module.exports.Product = Product;

class Order extends Model {}
Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  totalValue: DataTypes.FLOAT
}, {
  sequelize,
  modelName: "order"
});
module.exports.Order = Order;

class OrderItem extends Model {}
OrderItem.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: DataTypes.INTEGER,
  name: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  productId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: "order-item"
});
module.exports.OrderItem = OrderItem;