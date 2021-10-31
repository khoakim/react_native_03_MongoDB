
// 10_ ensures "mongoose.model('User',userSchema);" only executed once
// in any other file we will access User Model with the syntax `const User=mongoose.model("User")` 
require('./models/User');

// 37b_ We want to "require in" at least once in our code
require('./models/Track');
const express=require('express');

// We need Mongoose to connect to connect to Mongo DB
const mongoose=require('mongoose');
// const bodyParser=require('body-parser');
// 07_ associates all request handlers in authRoutes.js to the main body of application
const authRoutes=require('./routes/authRoutes');

// 41a_ use trackRoute that we've just created
const trackRoutes=require('./routes/trackRoutes');

const requireAuth=require('./middlewares/requireAuth');


const app = express();

// We want to parse the body of request before calling routing
app.use(express.json());


// handle routing such as "/signup" "/signin"
app.use(authRoutes);

// 41b_ associated trackRoutes with "app" object
app.use(trackRoutes);

// 03_ get connection string to Mongo DB (from Mongo DB website)
const mongoUri = 'mongodb+srv://user01:passwordpassword@cluster0.gkzsm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// 04_ actually connect to Mongo DB through moongoose
mongoose.connect(mongoUri);

// 05a_ set up call back function to run when connection is successful i.e. "connected"
mongoose.connection.on('connected',()=>{
    console.log('Successfully connected to MongoDB!!!');
});

// 05b_ set up call back function to run when connection is NOT successful i.e. "error"
mongoose.connection.on('error',(err)=> {
    console.log('error connecting to db');
});

// 01_when user access this route, requireAuth will run first
// 23_inject middleware for pre-processing
//    from "app.get('/', (req,res)=> {"
//    to "app.get('/',requireAuth, (req,res)=> {"
app.get('/',requireAuth, (req,res)=> {
    // 24_ accessing user email which we attached to request in step "21"
    res.send(`Your email : ${req.user.email}`);
});

// 02_ the app will now listen to certain and handle requests to certain port
app.listen(3000, () => {
    console.log('Listening on port 3000');
});