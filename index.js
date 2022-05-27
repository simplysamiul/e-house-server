// Title: E-house backend.
// Author: Md Samiul Islam.
// Project Owner: Md Samiul Islam
// Description: This is e-commerce based project there are have lots of categories     product and client can given order and buy this project. 

const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000 ;
require('dotenv').config();


// Db connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iofdum6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        // db and collection
        await client.connect();
        const database = client.db("eHouseStore");
        const allProductCollection = database.collection("allCategoriesProduct");

        // get all categories product
        app.get("/allproducts", async(req, res)=>{
            const cursor = allProductCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });
        // get specific categories product data
        app.get("/allproducts/categories/:categoryname", async(req, res)=>{
            const categoryName = req.params.categoryname;
            const query = {categories : categoryName};
            const cursor = allProductCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
        });
        // get new and best sales product
        app.get("/allproducts/:condition", async(req,res)=>{
            const productCondition = req.params.condition;
            if(productCondition == "new"){
                const query = {condition : productCondition};
                const cursor = allProductCollection.find(query);
                const result = await cursor.toArray();
                res.json(result);
            }
            else if(productCondition == "best"){
                const query = {sale : productCondition};
                const cursor = allProductCollection.find(query);
                const result = await cursor.toArray();
                res.json(result);
            }
            else{
                res.send("product Not found !!!")
            }
        });
    }finally{
        // await client.close();
    }
}
run().catch(console.dir);



// Root route
app.get("/", (req,res)=>{
    res.send("E-house server started")
});

// Port connecting
app.listen(port, ()=>{
    console.log(`Port listening at ${port}`);
})