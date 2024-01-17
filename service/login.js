const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
})
const util = require('../utils/utils')
const auth = require('../utils/auth')
const bcrypt=require('bcryptjs')
const dynamodb =new AWS.DynamoDB.DocumentClient();
const userTable = "examiners";

async function login(user){
    const username = user.email;
    const password = user.password;
    if(!user || !email || !password){
        return util.buildResponse(401, {
            message: 'Username & Password are required'
        })
    }
    const dynamoUser = await getUser(username.toLowerCase().trim());
    if(!dynamoUser || !dynamoUser.username){
        return util.buildResponse(403, {message: 'Password/Email is incorrect'})
    }
    if(!bcrypt.compareSync(password,dynamoUser.password)){
        return util.buildResponse(403, {message:'Password/Email is incorrect'})

    }
    const userInfo ={
        username: dynamoUser.username,
        name: dynamoUser.name,
        option: dynamoUser.option,
        station: dynamoUser.station,
        user: dynamoUser.userRole

    }
    const token =auth.generateToken(userInfo)
    const response = {user:userInfo, token:token}
    return util.buildResponse(200, response);
       
}

async function getUser(email){
    const params = {
        TableName:userTable,
        Key: {email:email}
    }
    return await dynamodb.get(params).promise().then(response=>{
        return response.Item;
    }, error=>{console.error('There is an error', error)})
}
module.exports.login =login