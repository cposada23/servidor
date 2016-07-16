const mongoose  = require('mongoose');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    profilePicture: String,
    pictures:[{type:String}],
    hashedPassword:String,
    salt: String,
    displayName: {type: String, unique:true},
    rol: {type:String, default:'user'},
    profiles: {
        local:{type:Boolean, default:false},
        facebook: String,
        google: String,
        twiter: String,

    },
    tokens: Array
}, { timestamps: true });

//Virtuals
userSchema.virtual('password').set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
}).get(function () {
    return this._password;
});

userSchema.methods = {

    /**
     * Autenticación
     * @param plainText
     * @returns {boolean}
     */
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    /**
     *
     * @returns {string|String|*}
     */
    makeSalt : function () {
        return crypto.randomBytes(16).toString('base64');
    },
    /**
     *
     * @param password
     * @returns {string|*|String}
     */

    encryptPassword: function (password) {
        if(!password || !this.salt) return '   ';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt,10000, 64).toString('base64');
    }


};

module.exports = mongoose.model('User', userSchema);