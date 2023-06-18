const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.btn7gge.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const d = client.db("ecommerce");
        app.get("/product-by-type", async (req, res) => {
            let result = await d.collection("products").find({}, { projection: { t: 1, _id: 0 } }).toArray();

            let jsonObject = result.map(JSON.stringify);
            let uniqueSet = new Set(jsonObject);
            let uniqueArray = Array.from(uniqueSet).map(JSON.parse);

            let arr = new Array();
            await Promise.all(uniqueArray.map(async (e) => {
                let result2 = await d.collection("products").find({ t: e.t }).toArray();
                let obj = { name: e.t, more: result2 };
                arr.push(obj);
            }))
            res.send(arr);
        })

        app.get("/product-detail/:id", async (req, res) => {
            const id = req.params.id;
            let result = await d.collection("products").findOne({ _id: new ObjectId(id) });
            res.send(result);
        })
        app.get("/product-by-category/:category", async (req, res) => {
            const category = req.params.category;
            let result = await d.collection("products").find({ c: category }).toArray();

            let arr = new Array();
            let obj = { name: category, more: result };
            arr.push(obj);

            res.send(arr);
        })
        app.get("/all-category/", async (req, res) => {
            let result = await d.collection("products").find({}, { projection: { c: 1, _id: 0 } }).toArray();

            let jsonObject = result.map(JSON.stringify);
            let uniqueSet = new Set(jsonObject);
            let uniqueArray = Array.from(uniqueSet).map(JSON.parse);

            res.send(uniqueArray);
        })

        app.get("/all-product", async (req, res) => {
            let result = await d.collection("products").find().toArray();
            res.send(result);
        })


        app.post("/add-singel-product", async (req, res) => {
            const result = await d.collection("products").insertOne(req.body);
            res.send(result);
        })


        app.put("/update-singel-product/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateProduct = req.body;

            const updates = { $set: updateProduct };
            const result = await d.collection("products").updateOne(filter, updates);

            res.send(result);
        })
        app.delete("/delete-product-by-id/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await d.collection("products").deleteOne(filter);

            res.send(result);
        })



        app.get("/hero", async (req, res) => {
            let result = await d.collection("hero").find().toArray();
            res.send(result);
        })

        app.get("/single-hero/:id", async (req, res) => {
            const id = req.params.id;
            let result = await d.collection("hero").findOne({ _id: new ObjectId(id) });
            res.send(result);
        })

        app.post("/add-hero", async (req, res) => {
            const result = await d.collection("hero").insertOne(req.body);
            res.send(result);
        })

        app.put("/update-hero/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateProduct = req.body;

            const updates = { $set: updateProduct };
            const result = await d.collection("hero").updateOne(filter, updates);

            res.send(result);
        })
        app.delete("/delete-hero-by-id/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await d.collection("hero").deleteOne(filter);

            res.send(result);
        })


    } finally {

    }
}


run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})