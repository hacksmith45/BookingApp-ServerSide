const jwt = require("jsonwebtoken");


const verifyToken = (req,res,next) => {
     const token = req.cookies.access_token;
     if(!token) {
      return res.status(401).json({success:false, msg:"You are not authenticated!"});
     }
      
     jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
        if(err) return res.status(403).json({success:false, msg:"Token is not Valid!"});
        req.user = user;
        next();
     })
};


const verifyUser = (req,res,next) => {
    verifyToken(req,res,next, () => {
       if(req.user.id === req.params.id || req.user.isAdmin){
          next()
       } else {
          return res.status(403).json({success:false, msg:"You are not authorized!"})
       }
    })
}


const verifyAdmin = (req,res,next) => {
   verifyToken(req,res,next, () => {
      if(req.user.isAdmin){
         next()
      } else {
         return res.status(403).json({success:false, msg:"You are not authorized!"})
      }
   })
}

module.exports = { verifyToken, verifyUser, verifyAdmin }