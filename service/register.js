const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const util = require('../utils/utils');
const bcrypt = require('bcryptjs');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "examiners";

async function register(userInfo) {
    const { name, email, username, station,option, userRole, password } = userInfo;

    if (!username || !name || !password) {
        return util.buildResponse(400, {
            message: 'All fields are required'
        });
    }

    try {
        const dynamoUser = await getUser(username.toLowerCase().trim());
        if (dynamoUser) {
            return util.buildResponse(400, {
                message: 'Username already exists, please use a different username'
            });
        }

        const encryptedPw = bcrypt.hashSync(password.trim(), 10);
        const user = {
            name,
            email,
            username: username.toLowerCase().trim(),
            station,
            option,
            userRole,
            password: encryptedPw
        };

        const saveUserResponse = await saveUser(user);
        if (!saveUserResponse) {
            return util.buildResponse(503, { message: 'Server Error, Please try again' });
        }

        return util.buildResponse(200, { username });
    } catch (error) {
        console.error('Error in registration:', error);
        return util.buildResponse(500, { message: 'Internal Server Error' });
    }
}

async function getUser(username) {
    const params = {
        TableName: userTable,
        Key: { username }
    };
    try {
        const response = await dynamodb.get(params).promise();
        return response.Item;
    } catch (error) {
        console.error('There is an error getting the user:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

async function saveUser(user) {
    const params = {
        TableName: userTable,
        Item: user
    };
    try {
        await dynamodb.put(params).promise();
        return true;
    } catch (error) {
        console.error("There was an error saving the user:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

module.exports.register = register;
