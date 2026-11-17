const jwt = require('jsonwebtoken');

function checkLogin(req, res, next) {
    let header = req.headers.authorization;
    if (!header) {
        return res.status(401).send("Unauthorized");
    }
    let token = header.split(' ')[1];
    
    try {
        let decoded = jwt.verify(token, "thisisyourprivatekey");
        // 👇 NEW: Attach the decoded ID to the request
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).send("Unauthorized");
    }
}

module.exports = checkLogin;