const mongoose = require("mongoose");

const userSchema =
new mongoose.Schema(
{
    firstName:
    {
        type: String,
        required: true,
        trim: true
    },

    lastName:
    {
        type: String,
        default: ""
    },

    email:
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password:
    {
        type: String,
        required: true
    },

    phone:
    {
        type: String,
        default: ""
    },

    role:
    {
        type: String,
        enum:
        [
            "USER",
            "ADMIN"
        ],
        default: "USER"
    },

    isActive:
    {
        type: Boolean,
        default: true
    },

    isEmailVerified:
    {
        type: Boolean,
        default: false
    },

    lastLogin:
    {
        type: Date,
        default: null
    },

    subscriptionPlan:
    {
        type: String,
        enum:
        [
            "FREE",
            "BASIC",
            "PRO",
            "PREMIUM"
        ],
        default: "FREE"
    },

    subscriptionExpiry:
    {
        type: Date,
        default: null
    },

    botEnabled:
    {
        type: Boolean,
        default: false
    },

    refreshToken:
    {
        type: String,
        default: null
    },

    lastLogout:
    {
        type: Date,
        default: null
    }
},
{
    timestamps: true
});

module.exports =
mongoose.model(
    "User",
    userSchema
);