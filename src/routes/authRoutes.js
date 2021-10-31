const express = require('express');
const mongooose = require('mongoose');
// 11_ Accessing User Model
const User = mongooose.model('User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 06_ when someone makes a post request to /signup
router.post('/signup', async (req,res)=>{
    // console.log(req.body);

    // 15_ error handling with signup request
    try{
        // 12_ deconstruct email and password from body
        const {email,password}=req.body;
        // 13_ create a User object
        const user = new User({email,password});
        // 14_ send create new user request to Mongo
        await user.save();
        // 16_ create JWT through signing object with a key
        const token = jwt.sign({userId:user._id},'MY_SECRET_KEY');
        // 17_ send token back to user. We will use Token to identify a user in subsequent user
        res.send({token});
    } catch (err) {
        // We will send a response back with an error code of "422" to user
        // We will then stop processing further ==> put "return" at the beginning
        return res.status(422).send(err.message);
    }
    
});

//29_ when someone tries to sign in, we will run this function
router.post('/signin', async (req,res) => {
    // when user signin, they must have provided email and PW
    // we will pull it from the request
    const {email,password}=req.body;
    if (!email||!password) {
        return res.status(422).send({error:'Must provide email or password'});
    }

    // pick up corresponding user from MongoDB
    const user = await User.findOne({email});

    if (!user){
        return res.status(422).send({error:'Invalid password or email'});
    }

    try  {
        await user.comparePassword(password);
        // 30_ once compare is successful, send a token back to user to use in subsequent requests
        const token=jwt.sign({userId:user._id},'MY_SECRET_KEY');
        res.send({token});

    } catch (err) {
        return res.status(422).send({error:'Invalid password or email'});
    }
    
});

// 06b_ export module to use
module.exports=router;