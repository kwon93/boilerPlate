const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({

    name:{
        type: String,
        maxLength: 50
    },

    email:{
        type:String,
        trim: true,
        unique: 1
    },
    password:{
        type:String
    },
    lastName:{
        type: String,
        maxLength: 50
    },
    role:{
        type:Number,
        default: 0
    },
    image: String,
    token:{
        type:String
    },
    tokenExp:{
        type: Number
    }
})

userSchema.pre('save', function(next){
    // 비밀번호를 암호화 하기
    var user = this;
    
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        });
    }else{
        next();
    }
    

})

userSchema.methods.comparePassword = function(plainPassword, cb){
    
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    });
}

userSchema.methods.generateToken = function(cb){
    var user = this;

    var token = jwt.sign(user._id.toString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })

}


const User = mongoose.model('User', userSchema)

module.exports = {User}