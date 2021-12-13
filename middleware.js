const jwt = require('jsonwebtoken');

// module.exports.generateToken = function(user){
//     return jwt.sign({
//         _id : user._id,
//         name : user.name,
//         email : user.email,
//         isAdmin : user.isAdmin,
//         isSeller : user.isSeller,
//     },
//     process.env.JWT_SECRET || 'vn',
//     {
//         expiresIn : '4h'
//     }
//     )
// };
module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SEC || 'vn', (err, user) => {
        if (err) res.status(403).json("Token is not valid!");
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You are not authenticated!");
    }
  };
module.exports.isAuth =  function(req,res,next){
    const authorization = req.headers.authorization
    if(authorization){
        const token = authorization.slice(7,authorization.length);
        jwt.verify(token,process.env.JWT_SECRET || 'vn',(err,decode)=>{
            if(err) {
                res.status(401).send({message : 'Invalid Token'});
            }else {
                req.user = decode;
            }
            next();
        })
    }else {
        res.status(401).send({message : 'No Token'});
    }
};

module.exports.isAdmin = function(req,res,next) {
    if (req.user && req.user.isAdmin){
        next();
    }else {
        res.status(401).send({message : 'Invalid Admin Token'})
    }
}

module.exports.isSeller = function(req,res,next){
    if(req.user && req.user.isSeller){
        next();
    }else {
        res.status(401).send({message : 'Invalid Seller Token'})
    }
}

