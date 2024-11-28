const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const ErrorHandler = require("../lib/errorHandler");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    // Regex for valid email (must contain @ and .com)
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: "Please enter a valid email address",
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
            validate: {
                validator: function (v) {
                    // Regex for password with at least one special character, one uppercase letter, and one lowercase letter
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/.test(v);
                },
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
            },
        },
        role: {
            type: String,
            ref: "Role",
            required: true,
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);



// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/.test(this.password)) {
        return next(
            new ErrorHandler(
                "Password must contain at least one uppercase letter, one lowercase letter, and one special character", 400
            )
        );
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (e) {
        next(e);
    }
});

// For password comparison
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userSchema);
module.exports = User;