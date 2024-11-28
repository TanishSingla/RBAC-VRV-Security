const jwt = require("jsonwebtoken");
const User = require('./../models/user.model.js');

const isAuthenticated = async (req, resp, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return resp.status(401).json({
                message: "Unauthorized access",
                success: false
            });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                return resp.status(401).json({
                    message: "User not found, Try logging in again",
                    success: false
                });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return resp.status(401).json({
                    message: "Unauthorized access, Token Expired",
                });
            }
            throw error;
        }

    } catch (error) {
        console.log("Error in authentication", error);
        resp.status(401).json({
            message: "Unauthorized access - Invalid access Token",
        });
    }
};

const isRole = (roles) => {
    return async (req, resp, next) => {
        if (req.user && roles.includes(req.user.role)) {
            return next();
        } else {
            return resp.status(403).json({
                message: `Access denied, You are not allowed to access this URL`,
                success: false
            });
        }
    };
};


module.exports = { isAuthenticated, isRole }; 