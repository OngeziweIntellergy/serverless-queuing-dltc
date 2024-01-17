const util = require('../utils/utils');
const auth = require('../utils/auth');

function verify(requestBody) {
    if (!requestBody.user || !requestBody.user.email || !requestBody.token) {
        return util.buildResponse(401, {
            verified: false,
            message: 'Incorrect request body'
        });
    }

    try {
        const user = requestBody.email;
        const token = requestBody.token;
        const verification = auth.verifyToken(user.email, token);

        if (!verification.verified) {
            return util.buildResponse(401, verification);
        }

        return util.buildResponse(200, {
            verified: true,
            message: 'Success', 
            user: user,
            token:token
            // Consider removing sensitive information like 'user' and 'token' from the response
        });
    } catch (error) {
        // Log the error for debugging
        console.error(error);
        // Return a generic 500 error response
        return util.buildResponse(500, {
            verified: false,
            message: 'Internal server error'
        });
    }
}

module.exports.verify = verify;
