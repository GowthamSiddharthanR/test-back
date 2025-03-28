const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const URL = process.env.DB;
app.use(
  cors({
    origin: "http://localhost:5173",
    // origin: "https://food-crud.vercel.app",
  })
);
app.use(express.json());
app.get("/orders", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("webbro");
    const collection = db.collection("orders");
    const orders = await collection.find({}).toArray();
    await connection.close();
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
app.post("/user", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("webbro");
    const collection = db.collection("orders");
    if (!req.body.name) {
      res.status(400).json({
        message: "Please provide order name",
      });
    } else {
      await collection.insertOne(req.body);
      await connection.close();
      res.json({
        message: "order Created successfully ",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
app.get("/order/:id", async (req, res) => {
  const connection = await MongoClient.connect(URL);
  const db = connection.db("webbro");
  const collection = db.collection("orders");
  const order = await collection.findOne({
    _id: new ObjectId(req.params.id),
  });
  await connection.close();
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
app.put("/order/:id", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db("webbro");
    const collection = db.collection("orders");
    delete req.body._id;
    const order = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: req.body,
      }
    );
    await connection.close();
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Somrhting went worng",
    });
  }
});
app.delete("/order/:id", async (req, res) => {
  const connection = await MongoClient.connect(URL);
  const db = connection.db("webbro");
  const collection = db.collection("orders");
  await collection.findOneAndDelete({ _id: new ObjectId(req.params.id) });
  await connection.close();
  res.json({ message: "Deleted Successfully" });
});
module.exports = app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webserver is running on port ${PORT}`);
});

