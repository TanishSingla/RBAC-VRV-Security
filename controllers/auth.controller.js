const catchAsyncError = require('../lib/catchAsyncError.js');
const ErrorHandler = require('../lib/errorHandler.js');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

// for generating access and refresh tokens.
const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
    return { accessToken, refreshToken };
};


const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

const signup = catchAsyncError(async (req, res, next) => {

    const { email, password, name } = req.body;

    //will check if user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
        console.log("helllo")
        return next(new ErrorHandler("User already exists", 400));
    }
    //if not then we will create a new user
    const user = await User.create({
        name, email, password
    });

    const { accessToken, refreshToken } = generateToken(user._id);

    setCookies(res, accessToken, refreshToken);

    // password is hashed in user model
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "User created Successfully"
    });
});

const login = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;
    // console.log(email, password);
    const user = await User.findOne({ email });

    //will check if user exists and also if password matches (compare password is in user model)
    if (user && (await user.comparePassword(password))) {
        const { refreshToken, accessToken } = generateToken(user._id);
        setCookies(res, accessToken, refreshToken);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: "Login Successful"
        });
    }
    return next(new ErrorHandler("Invalid Credentials", 401));
});

const logout = catchAsyncError(async (req, res) => {

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json({
        message: "Logged out successfully"
    });

    res.status(500).json({
        message: `Server Error, While logging out, error: ${error.message}`
    });
})

// for refreshing tokens. (basically for creating new access token)
const refreshToken = catchAsyncError(async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "No refresh token, Please Login again"
            });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // generating a new access token.
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m"
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        res.status(200).json({
            message: "Token refreshed successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: `Internal Server Error. error:${error.message}`
        });
    }
});

const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//get all users for admin only
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//admin can assign role to any user.
const assignRoleByAdmin = catchAsyncError(async (req, res, next) => {
    const { userId, role } = req.body;

    if (!userId || !role) {
        return next(new ErrorHandler("Please provide a valid userId and role", 404));
    }
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    user.role = role;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Role assigned successfully",
    });
});

const deleteUserByAdmin = catchAsyncError(async (req, res, next) => {
    const userId = req.params.id;
    if (!userId) {
        return next(new ErrorHandler("User not found", 404));
    }
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    await User.deleteOne({ _id: userId });
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});


const routeForOnlyManagerAndAdmin = (req, res, next) => {

    return res.status(200).json({
        success: true,
        message: "Only great people can access this route (Manager and Admin 😌)"
    })
};

module.exports = { signup, login, logout, refreshToken, getProfile, getAllUsers, assignRoleByAdmin, deleteUserByAdmin, routeForOnlyManagerAndAdmin }; 