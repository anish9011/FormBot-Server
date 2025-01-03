const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(403).json({ status: "error", msg: "Token not found or invalid format" });
        }

        const jwtToken = token.split(' ')[1]; // Extract token

        const data = jwt.verify(jwtToken, process.env.JWT_SECRET); // Verify JWT
        req.user = data.uid; // Store the user ID in the request object
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(400).json({ status: "error", msg: "Invalid token" });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ status: "error", msg: "Token expired" });
        }
        return res.status(500).json({ status: "error", msg: "Internal server error" });
    }
};

module.exports = verifyToken;
