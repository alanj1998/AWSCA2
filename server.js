const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const { Product, Order, OrderItem } = require("./model");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.get("/products", async (req, res) => {
  await Product.sync();
  const products = await Product.findAll();
  res.send({
    products,
  });
});

app.get("/bootstrap", async (req, res) => {
  await Product.drop();
  await Order.drop();
  await OrderItem.drop();
  await Order.sync();
  await OrderItem.sync();
  await Product.sync();
  await Product.create({
    name: "Surgical Mask",
    code: "MSK",
    status: "Available",
    provider: "Tom's Masks",
    pricePerUnit: 5.5,
    unitsAvailable: 10,
  });

  await Product.create({
    name: "Hamzaz Suit",
    code: "HMZ",
    status: "Available",
    provider: "Penneys",
    pricePerUnit: 10000,
    unitsAvailable: 1,
  });

  await Product.create({
    name: "Hand Sanitizer",
    code: "HST",
    status: "Available",
    provider: "Bacardi",
    pricePerUnit: 10.5,
    unitsAvailable: 2,
  });

  res.send();
});

app.post("/order", async (req, res) => {
  const { name, address, totalValue, orderItems } = req.body;
  await Order.sync();
  const newOrder = await Order.create({
    name,
    address,
    totalValue,
  });

  await OrderItem.sync();
  await Product.sync();
  for (let order of orderItems) {
    await OrderItem.create({
      orderId: newOrder.id,
      name: order.name,
      quantity: order.quantity,
      productId: order.productId,
    });

    const product = await Product.findByPk(order.productId);
    const unitsAvailable = product.unitsAvailable;
    let status =
      unitsAvailable - order.quantity == 0 ? "Unavailable" : "Available";

    await Product.update(
      {
        status,
        unitsAvailable: unitsAvailable - order.quantity,
      },
      {
        where: {
          id: product.id,
        },
      }
    );
  }

  res.send({
    message: "Order placed successfully!",
    statusCode: 200,
  });
});

app.post("/reset", async (req, res) => {
  const productId = req.body;
  await Product.sync();
  await Product.update(
    { unitsAvailable: 5 },
    {
      where: { id: productId },
    }
  );
});

app.listen(3000, () => {
  console.log("Listening on :3000");
});
