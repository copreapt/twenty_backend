const createTokenUser = require('./createTokenUser');
const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createHash = require('./createHash');
const checkPermissions = require('./checkPermissions');
const sendVerificationEmail = require('./sendVerificationEmail');

module.exports = {
    createTokenUser,
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createHash,
    checkPermissions,
    sendVerificationEmail,
}