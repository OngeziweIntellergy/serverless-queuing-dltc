const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'ticket-management'; // Consider using an environment variable
const healthPath = '/health';
const ticketPath = '/ticket';
const ticketsPath = '/tickets';

exports.handler = async function(event) {
    console.log("Request event", event);
    let response;
    try {
        switch(true) {
            case event.httpMethod === 'GET' && event.path === healthPath:
                response = buildResponse(200, { message: "Service is healthy" });
                break;
            case event.httpMethod === 'GET' && event.path === ticketPath:
                response = await getSingleTicket(event.queryStringParameters.ticketId);
                break;
            case event.httpMethod === 'GET' && event.path === ticketsPath:
                response = await getTickets();
                break;
            case event.httpMethod === 'POST' && event.path === ticketPath:
                response = await saveTicket(JSON.parse(event.body));
                break;
            case event.httpMethod === 'PATCH' && event.path === ticketPath:
                const requestBody = JSON.parse(event.body);
                response = await modifyTicket(requestBody.ticketId, requestBody.updateKey, requestBody.value);
                break;
            case event.httpMethod === 'DELETE' && event.path === ticketPath:
                response = await deleteTicket(JSON.parse(event.body).ticketId);
                break;
            default:
                response = buildResponse(404, { message: '404 Not Found' });
        }
    } catch (error) {
        console.error('Error:', error);
        response = buildResponse(500, { message: 'Internal Server Error' });
    }
    return response;
};

async function getSingleTicket(ticketId) {
    // Validate ticketId here
    const params = {
        TableName: dynamodbTableName,
        Key: { 'ticketId': ticketId }
    };
    try {
        const response = await dynamodb.get(params).promise();
        return buildResponse(200, response.Item);
    } catch (error) {
        console.error('Error:', error);
        return buildResponse(500, { message: 'Internal Server Error' });
    }
}

async function getTickets() {
    const params = { TableName: dynamodbTableName };
    try {
        const tickets = await scanDynamoRecords(params, []);
        return buildResponse(200, { tickets });
    } catch (error) {
        console.error('Error:', error);
        return buildResponse(500, { message: 'Internal Server Error' });
    }
}

async function scanDynamoRecords(scanParams, itemArray) {
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if (dynamoData.LastEvaluatedKey) {
            scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
            return await scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow error to be caught by the caller
    }
}

async function saveTicket(requestBody) {
    // Validate requestBody here
    const params = {
        TableName: dynamodbTableName,
        Item: requestBody
    };
    try {
        await dynamodb.put(params).promise();
        return buildResponse(200, { Operation: 'SAVE', Message: 'SUCCESS', Item: requestBody });
    } catch (error) {
        console.error('Error:', error);
        return buildResponse(500, { message: 'Internal Server Error' });
    }
}

async function modifyTicket(ticketId, updateKey, updateValue) {
    // Validate inputs here
    const params = {
        TableName: dynamodbTableName,
        Key: { 'ticketId': ticketId },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: { ':value': updateValue },
        ReturnValues: 'UPDATED_NEW'
    };
    try {
        const response = await dynamodb.update(params).promise();
        return buildResponse(200, { Operation: 'UPDATE', Message: 'SUCCESS', UpdatedAttributes: response });
    } catch (error) {
        console.error('Error:', error);
        return buildResponse(500, { message: 'Internal Server Error' });
    }
}

async function deleteTicket(ticketId) {
    // Validate ticketId here
    const params = {
        TableName: dynamodbTableName,
        Key: { 'ticketId': ticketId },
        ReturnValues: 'ALL_OLD'
    };
    try {
        const response = await dynamodb.delete(params).promise();
        return buildResponse(200, { Operation: 'DELETE', Message: 'SUCCESS', Item: response });
    } catch (error) {
        console.error('Error:', error);
        return buildResponse(500, { message: 'Internal Server Error' });
    }
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}
