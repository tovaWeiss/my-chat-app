const jwt = require("jsonwebtoken");

const { secretCode } = require("../config");;

const verifyToken = (req, res, next) => {
    let token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;
    
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        token = token.replace("Bearer ", "");
        const decoded = jwt.verify(token, secretCode);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;