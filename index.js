const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const {User} = require("./model/user")

const mongoose = require('mongoose');

const config = require('./config/key')

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology:true
})
.then(()=>{console.log("mongoDB Connected..")})
.catch(err=> console.log(err));

app.get('/', (req,res)=> res.send("hello World!!!!"));

app.post("/register", (req,res)=>{

    //회원가입할때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어주기
    const newUser = new User(req.body);  

    newUser.save()
        .then(doc => {
            return res.status(200).json({ success: true });
        })
        .catch(err => {
            return res.json({ success: false, err });
        });
     

})

app.listen(port, ()=> console.log(`Example App listening on port ${port}!`));