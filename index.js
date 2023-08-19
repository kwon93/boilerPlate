const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://kwon:MgS1e4fYsVTcOn7S@boiler-plate.z4rfmzz.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology:true
})
.then(()=>{console.log("mongoDB Connected..")})
.catch(err=> console.log(err));

app.get('/', (req,res)=> res.send("hello World!"));

app.listen(port, ()=> console.log(`Example App listening on port ${port}!`));