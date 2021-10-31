const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
// 08_ tell Moongose about Data Model in Mongo DB
const userSchema = new mongoose.Schema({
    email:{
        type:  String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// 25_ implementing pre-save hook (salting password)
// It is a function to run before we save a user to our DB
// we used keyword function "function" b/c we want to access this user via "this"
// arrow function will scope "this" to within the function which is not what we want
// so that we only save HASHED, SALTED PASSWORD
userSchema.pre('save', function(next){
    const user = this;

    // if the user has not modified their password in anyway, then don't SALT
    // next() is the next step in middleware
    if (!user.isModified('password')){
        return next();
    }

    // 26_ generating hash and updating password
    // the first argument to genSalt, "10" in this case, refers to how complex we want the salt to be
    bcrypt.genSalt(10,(err,salt)=> {
        // if there is an err in generating our SALT, then pass in the erro to next step
        if (err) {
            return next(err);
        }

        // 27_ updating password on successful generating of SALT
        // when we get here, we have successfully generated a SALT
        // 3rd arg = callback function with an errr or resulting hash
        bcrypt.hash(user.password, salt, (err,hash)=>{
            if (err) {
                return next(err);
            }
            
            // 
            user.password=hash;
            next();
        })
    });
});

// 28_ check the user login's password agaisnt what we in our DB
userSchema.methods.comparePassword = function (candidatePW) {
    const user = this;

    // whenever we create a Promise, we pass to it a callback function
    // This function will be automatically executed with two arguments "resove" and "reject"
    // if everything goes well, it will be resolved
    return new Promise((resolve,reject)=> {
        bcrypt.compare(candidatePW,user.password, (err,isMatch)=> {
            if (err) {
                // if there is an err, we will invoke "reject" and pass in the err
                return reject(err);
            }

            // password is not matching
            if (!isMatch){
                return reject(false);
            }

            // PASSWORD is now MATCHING
            resolve(true);
        });
    });
}

// 09_ communicates that there is now a data model called "User" to be used
mongoose.model('User',userSchema);