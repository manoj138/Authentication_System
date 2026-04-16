// middleware/authMiddleware.js
const { verifyToken } = require('../helper/authHelper');
const { handle401 } = require('../helper/errorHandler');

/**
 * Authentication Middleware
 * Checks for JWT token in Authorization header
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return handle401(res, "No token provided, access denied");
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return handle401(res, "Invalid or expired token");
    }

    // Attach user data to request object
    req.user = decoded;
    next();
};

/**
 * Role Authorization Middleware
 * Checks if the user's role matches one of the allowed roles
 */
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: false,
                message: "Forbidden: You don't have permission to perform this action"
            });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole,
};
