const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

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


app.post('/login', (req, res)=>{
    User.findOne({email: req.body.email}, (err, userInfo)=>{
        if(!userInfo){
            return res.json({success: false, message: "제공된 이메일에 해당하는 유저가 없습니다."})
        }
        User.findOne({email: req.body.email}).exec()
             .then(userInfo => {
        // ...
             })
        .catch(err => {
        // ...
         });

        // 위의 코드에서 올바르게 처리된 후에 아래의 코드가 나와야 함
        userInfo.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch)
            return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});

            userInfo.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 저장할 곳을 정하기 (쿠키, 세션, 로컬스토리지 중...)
                res.cookie("x_auth",user.token) 
                .status(200)
                .json({loginSuccess : true, userId: user._id});
            });
        });
    });
});

app.listen(port, ()=> console.log(`Example App listening on port ${port}!`));