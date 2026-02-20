const jwt = require('jsonwebtoken')

// Middleware function to authenticate JWT tokens
function authenticateToken(req, res, next) {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No Token." });
    }

    const token = authHeader.split(" ")[1];
    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_Key);
        // { userID: ... }
        req.user = decoded;
        next();
    }
    // If token is invalid or expired, catch the error and respond with 403 Forbidden
    catch (err) {
        return res.status(403).json({ message: "Invalid Token." });
    }
}

module.exports = authenticateToken;
