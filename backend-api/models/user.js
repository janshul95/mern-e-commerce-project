// const mongoose = require("mongoose")
const mongoose = require('mongoose');
const crypto = require('node:crypto');
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userinfo: {
        type: String,
        trin: true
    },
    // TODO : comeback here
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    roles: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }

}, { timestamps: true })

userSchema.virtual("password")
    .set(function (password) {
        this._password = password
        this.salt = uuidv4()
        this.encry_password = this.securePassword(password)
    })
    .get(function () {
        this._password
    })

userSchema.methods = {
    authenticate: function (plainPassword) {
        const a = this.securePassword(plainPassword) === this.encry_password
        return a;
    },
    securePassword: function (plainPass) {
        if (!plainPass) return "";
        try {
            const securePass = crypto.createHmac('sha256', this.salt)
                .update(plainPass)
                .digest('hex');
            return securePass;

        }
        catch (err) {
            return ""
        }
    }
}

module.exports = mongoose.model("User", userSchema)