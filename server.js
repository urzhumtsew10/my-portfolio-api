const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { MongoClient, ObjectId } = require("mongodb");
const url = "mongodb+srv://andrew:Pass321@portfolio.7fcbtjd.mongodb.net/";
const mongoClient = new MongoClient(url);

const getOrders = async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("portfolio");
    const collection = db.collection("orders");
    const results = await collection.find().toArray();
    return results;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

const addOrder = async (data) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("portfolio");
    const collection = db.collection("orders");
    const results = await collection.insertOne(data);
    const products = await collection.find().toArray();
    return products;
  } catch (err) {
    console.log(err);
  } finally {
    await mongoClient.close();
  }
};

const app = express();
const PORT = 3030;

app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.json("Hello world 👋");
});

app.post("/order", async (req, res) => {
  const data = req.body;
  addOrder(data).then((data) => res.send(JSON.stringify(data)));
});

app.post("/orders", async (req, res) => {
  if (req.body.password === "Admin_part_$") {
    getOrders().then((data) => res.send(JSON.stringify(data)));
  } else {
    res.json([]);
  }
});

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server is listening port ${PORT}`);
});
