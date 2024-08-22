const jwt = require("jsonwebtoken");

// Middleware for verifying the token to access data
function verifyToken(req,res,next){
    if(req.headers.authorization!=undefined){
    let token=req.headers.authorization.split(" ")[1];
    jwt.verify(token,"pkdkey",(err,data)=>{
        if(!err){
            next();
        }
        else{
            res.status(401).send({message: "Invalid token"});
        }
    })
    }
    else{
        res.status(403).send({message:"Please send a token"});
    }
}

module.exports = verifyToken;