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

    const all = await products.find({}).toArray();
    console.log("Total products:", all.length);
    if (all.length > 0) {
      console.log("Sample product categories:");
      all.slice(0, 5).forEach(p => console.log(p.name, "=>", p.category));
    }
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
