const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const User=mongoose.model('User');

//18a_ Middleware will take an incoming request and do some PRE-processing on it such as if request has valid JWT
//18b_ If request has valid JWT, we will call "next" function in the middleware chain. When no more middleware, we will proceed to main request handler

module.exports = (req,res,next) => {
    
    // 19a_ For this app, we will require users to supply JWT in Authorization header
    // 19b_ Deconstructing Authorization header from users request for processing
    // ExpressAPI will lowercase headers
    const {authorization}=req.headers;

    // if user doesn't provide Authorization header, reject with generic error
    if (!authorization) {
        return res.status(401).send({error:'You must be logged in.'});
    }

    const token = authorization.replace('Bearer ','');
    
    // 20_ Verify JWT against secret key
    // 1st arg = token
    // 2nd arg = key
    // 3rd arg = function that will be invoked after JWT has done some validation on that token
    // "err" is any error from verification
    // "payload" will be an object {userId:User._id} from our database
    jwt.verify(token,'MY_SECRET_KEY', async (err, payload)=> {
        if (err){
            // we could provide more details but we don't want to provide too much info
            return res.status(401).send({error:'You must be logged in.'});
        }

        // we sign the token with this syntax jwt.sign({userId:user._id},'MY_SECRET_KEY');
        // Therefore, "verify" will return {userId:user._id} inside "payload" if there is no error
        // We will then deconstruct payload ({userId:user._id}) to capture userId in object
        const {userId}=payload;
        
        //find user in DB
        const user = await User.findById(userId);

        
        if (!user){
            return res.status(422).send({error:'Invalid password or email'});
        }
        // 21_ attach returned user model to req.user so that other processes can have access to it
        req.user = user;

        // 22_ go to the next middleware in the chains of middleware
        next();
    });
};