const express = require("express");
const app = express();
const port = process.env.PORT || 5000 ;





// Root route
app.get("/", (req,res)=>{
    res.send("E-house server started")
});

// Post connecting
app.listen(port, ()=>{
    console.log(`Port listening at ${port}`);
})