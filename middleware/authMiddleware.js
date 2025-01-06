const jwt = require('jsonwebtoken');
const signs = require("../model/signup");

const requireAuth = (req,res,next) =>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'Welcome to spirituality',(err, decodedToken)=>{
            if(err){
                console.log("not verified Jwt Token");
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect("/login");
    }
}

const currentUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'Welcome to spirituality',async(err, decodedToken)=>{
            if(err){
                console.log("user Not verified");
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToken);
                let user = await signs.findById(decodedToken.id);
                res.locals.user = user;
                req.user = user;
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports ={requireAuth,currentUser};