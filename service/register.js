const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
})
const util = require('../utils/utils')
const bcrypt=require('bcryptjs')
const dynamodb =new AWS.DynamoDB.DocumentClient();
const userTable = "examiners"

async function register(userInfo){
    const name =userInfo.name;
    const email =userInfo.email;
    const username =userInfo.username;
    const station =userInfo.station;
    const userRole =userInfo.userRole;
    const password =userInfo.password;

    if(!username || !name || !password){
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    const dynamoUser = await getUser(username);
    if(dynamoUser && dynamoUser.username){
        return util.buildResponse(401, {
            message:'Username already exists, please use a different username'
        })
    }
    const encryptedPw = bcrypt.hashSync(password.trim(), 10);
    const user = {
        name:name,
        email:email,
        username:username.toLowerCase().trim(),
        station:station,
        userRole:userRole,
        passsword:encryptedPw
    }

    const saveUserResponse = await saveUser(user);
    if(!saveUserResponse){
        return util.buildResponse(503, {message: ' Server Error, Please try again'})
    }

    return util.buildResponse(200, {username:username})


}
async function getUser(username){
    const params = {
        TableName:userTable,
        Key: {username:username}
    }
    return await dynamodb.get(params).promise().then(response=>{
        return response.Item;
    }, error=>{console.error('There is an error', error)})
}

async function saveUser(user){
    const params={
        TableName:userTable, 
        Item:user
    }
    return await dynamodb.put(params).promise().then(()=>{
        return true;
    }, error=>{console.error("There was an error saving the user", error)})
}

module.exports.register =register