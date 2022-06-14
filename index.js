// Title: E-house backend.
// Author: Md Samiul Islam.
// Project Owner: Md Samiul Islam
// Description: This is e-commerce based project there are have lots of categories     product and client can given order and buy this project. 

const express = require("express");
const app = express();
const cors = require("cors");
const { json } = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000 ;
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Middle ware
app.use(cors());
app.use(express.json());


// Db connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iofdum6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        // db and collection
        await client.connect();
        const database = client.db("eHouseStore");
        const allProductCollection = database.collection("allCategoriesProduct");
        const userCollecftion = database.collection("user");
        const shippingCollection = database.collection("shipping");
        const paymentCollection = database.collection("payment");

        // get all categories product
        app.get("/allproducts", async(req, res)=>{
            const cursor = allProductCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });
        // get specific product by id
        app.get("/allproducts/product_details/:id", async(req,res)=>{
            const id = req.params.id;
            const query ={_id : objectId(id)};
            const result = await allProductCollection.findOne(query);
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
        // All arivval products
        app.get("/allproducts/arrival", async(req,res)=>{
            const query = {condition : "new"};
            const page = req.query.page;
            const dataSize = parseInt(req.query.pagedata);
            const cursor = allProductCollection.find(query);
            const count = await allProductCollection.countDocuments(query);
            let arrivalProducts;
            if(page){
                arrivalProducts = await cursor.skip((page-1) * dataSize).limit(dataSize).toArray();
            }
            else{

                 arrivalProducts = await cursor.toArray();
            }
            res.send({count, arrivalProducts});
        });
        // Offer products
        app.get("/allproducts/offerdproducts", async(req,res)=>{
            const query = {sale : "best"};
            const cursor = allProductCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

         // get new product
        app.get("/allproducts/new", async(req,res)=>{
            const query = {condition : "new"};
            const page = req.query.page;
            const dataSize = parseInt(req.query.pagedata);
            const cursor = allProductCollection.find(query);
            const count = await allProductCollection.countDocuments(query);
            let newProducts;
            if(page){
                newProducts = await cursor.skip((page-1) * dataSize).limit(dataSize).toArray();
            }
            else{

                newProducts = await cursor.toArray();
            }
            res.send({count, newProducts});
        });

        // get new and best sales product
        app.get("/allproducts/best", async(req,res)=>{
                const query = {sale : "best"};
                const page = req.query.page;
                const dataSize = parseInt(req.query.pagedata);
                const cursor = allProductCollection.find(query);
                const count = await allProductCollection.countDocuments(query);
                let bestSales;
                if(page){
                    bestSales = await cursor.skip((page-1) * dataSize).limit(dataSize).toArray();
                }
                else{
    
                    bestSales = await cursor.toArray();
                }
                res.send({count, bestSales});
        });  
        // Get shope product
        app.get("/allproducts/shop", async(req,res)=>{
            const page = req.query.page;
            const dataSize = parseInt(req.query.pagedata);
            const cursor = allProductCollection.find({});
            const count = await allProductCollection.countDocuments({});
            let shopProducts;
            if(page){
                shopProducts = await cursor.skip((page-1) * dataSize).limit(dataSize).toArray();
            }
            else{
                shopProducts = await cursor.toArray();
            }
            res.json({count, shopProducts});
        });
        // Get specific Shipping info
        app.get("/shipping", async(req,res)=>{
            const email = req.query.email;
            const query = {email};
            const result = await shippingCollection.findOne(query);
            res.send(result);
        });
        // Get specific payment info
        app.get("/payment", async(req,res)=>{
            const email = req.query.email;
            const query = {email};
            const result = await paymentCollection.findOne(query);
            res.json(result);
        })

        // Post user
        app.post("/user", async(req,res)=>{
            const user = req.body;
            const result = await userCollecftion.insertOne(user);
            res.send(result);
        })
        // put or update user
        app.put("/user", async(req,res)=>{
            const user = req.body;
            const filter = {email: user.email};
            const options = {upsert: true};
            const updateDoc= {$set: user};
            const result = await userCollecftion.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        // Post shipping collection
        app.put("/shipping", async(req,res)=>{
            const shipping = req.body;
            const filter = {email: shipping.email};
            const options = {upsert: true};
            const updateDoc = {$set: shipping};
            const result = await shippingCollection.updateOne(filter, updateDoc, options );
            res.json(result);
        })
        // post payment info
        app.put("/payment", async(req,res)=>{
            const paymentInfo = req.body;
            const filter = {email: paymentInfo.email};
            const options = {upsert: true};
            const updateDoc = {$set: paymentInfo};
            const result = await paymentCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        // Stripe payment 
        app.post("/create-payment-intent", async(req,res)=>{
            const paymentInfo = req.body;
            console.log(paymentInfo);
            const amount = paymentInfo * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                currency: "usd",
                amount: amount,
                automatic_payment_methods: {
                    enabled: true,
                },
            })
            res.send({ clientSecret: paymentIntent.client_secret })
        })

        
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