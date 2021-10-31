const mongoose = require('mongoose');

// 33_ we have to define pointSchema before using it in trackSchema
const pointSchema = mongoose.Schema({
    timeStamp : Number,
    coords : {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number
    },
    
});

// 31_ define track Schema in Moongoose
const trackSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        // 32_ this is Moongoose specific which tells Mongoose that this "userId" is linked to a specific instance of a "User"
        ref: 'User'
    },
    name : {
        type: String,
        default: ''
    },
    locations: [pointSchema]
});

// 34_ tie some collection of data (such as "track")in MongoDB to Mongoose
mongoose.model('Track',trackSchema);