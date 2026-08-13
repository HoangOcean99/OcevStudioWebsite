const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Ocean9905:pRvGY58C2Efq43oR@cluster0.9gho2pt.mongodb.net/ocev?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("ocev");
    const products = db.collection("products");

    const res1 = await products.updateMany({ category: "streetwear" }, { $set: { category: "đồ nam" } });
    const res2 = await products.updateMany({ category: "cyberpunk" }, { $set: { category: "đồ nữ" } });
    const res3 = await products.updateMany({ category: "minimalist" }, { $set: { category: "đồ đôi" } });
    const res4 = await products.updateMany({ category: "techwear" }, { $set: { category: "đồ nam" } });

    console.log(`Updated products: ${res1.modifiedCount}, ${res2.modifiedCount}, ${res3.modifiedCount}, ${res4.modifiedCount}`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
