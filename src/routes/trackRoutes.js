// 35_ this function is to manange different routes that user took
const express = require('express');
const mongoose = require('mongoose');
// 36_ we use this middleware to ensure user is signed in
const requireAuth = require('../middlewares/requireAuth');

// 37a_ We want to use the "Track" model
const Track=mongoose.model('Track');

// create a new Express Router object
const router = express.Router();

// 38_ making sure that all requests using this route will require user to be signed in
router.use(requireAuth);

// 39_ 1st handler to get all tracks that have been created
router.get('/tracks', async (req,res)=> {

    // during sign-in process, user needs to supply username and password
    // 40_ we want all tracks that associated with the user
    const tracks = await Track.find({userId:req.user._id});

    res.send(tracks);
});

// 42_ 2nd handler to create tracks
router.post('/tracks', async (req,res)=> {
    // assume req will have struct like
    // { name, locations }
    // 43_ deconstruct "req" based on our assumption
    const {name,locations}=req.body;
    if (!name || !locations){
        return res.status(422).send({error:' You must provide a name and locations'});
    }

    try{
        const track = new Track({name,locations, userId:req.user._id});
        await track.save();
        res.send(track);
    } catch (err){
        res.status(422).send({error: err.message});
    }
    

});
module.exports=router;