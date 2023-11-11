const AWS =require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
})

const dynamodb = new AWS.DynamoDb.DocumentClient();
const dynamodbTableName ='ticket-management';
const healthPath = '/health';
const ticketPath = '/ticket';
const ticketsPath = '/tickets';

exports.handler = async function(event){
    console.log("request event", event);

    switch(true){
        case event.httpMethod === 'GET' && event.path ===healthPath:
            response =buildResponse(200)
            break;
        case event.httpMethod === 'GET' && event.path ===ticketPath:
            response =await getTicket(event.queryStringParameters.ticketId)
            break;
        case event.httpMethod === 'GET' && event.path ===ticketsPath:
            response =await getTicket()  
            break;
        case event.httpMethod === 'POST' && event.path ===ticketPath:
            response =await saveTicket(JSON.parse(event.body))
            break;
         case event.httpMethod === 'PATCH' && event.path ===ticketPath:
            const requestBody =JSON.parse(event.body)
            response =await modifyTicket(requestBody.ticketId,requestBody.updateKey, requestBody.value)
            break;
        case event.httpMethod === 'DELETE' && event.path ===ticketPath:
            response =await deleteTicket(JSON.parse(event.body).ticketId)
            break;
        default:
            response = buildResponse(404, '404 not Found')

}
return response;
}


async function getTicket(getTicket) {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'ticketId': ticketId
      }
    }
    return await dynamodb.get(params).promise().then((response) => {
      return buildResponse(200, response.Item);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    });
  }
  
  async function getTicket() {
    const params = {
      TableName: dynamodbTableName
    }
    const allProducts = await scanDynamoRecords(params, []);
    const body = {
      products: allProducts
    }
    return buildResponse(200, body);
  }
  
  async function scanDynamoRecords(scanParams, itemArray) {
    try {
      const dynamoData = await dynamodb.scan(scanParams).promise();
      itemArray = itemArray.concat(dynamoData.Items);
      if (dynamoData.LastEvaluatedKey) {
        scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
        return await scanDynamoRecords(scanParams, itemArray);
      }
      return itemArray;
    } catch(error) {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    }
  }
  
  async function saveTicket(requestBody) {
    const params = {
      TableName: dynamodbTableName,
      Item: requestBody
    }
    return await dynamodb.put(params).promise().then(() => {
      const body = {
        Operation: 'SAVE',
        Message: 'SUCCESS',
        Item: requestBody
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
  }
  
  async function modifyTicket(productId, updateKey, updateValue) {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'productId': ticketId
      },
      UpdateExpression: `set ${updateKey} = :value`,
      ExpressionAttributeValues: {
        ':value': updateValue
      },
      ReturnValues: 'UPDATED_NEW'
    }
    return await dynamodb.update(params).promise().then((response) => {
      const body = {
        Operation: 'UPDATE',
        Message: 'SUCCESS',
        UpdatedAttributes: response
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
  }
  
  async function deleteTicket(productId) {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'ticketId': productId
      },
      ReturnValues: 'ALL_OLD'
    }
    return await dynamodb.delete(params).promise().then((response) => {
      const body = {
        Operation: 'DELETE',
        Message: 'SUCCESS',
        Item: response
      }
      return buildResponse(200, body);
    }, (error) => {
      console.error('Do your custom error handling here. I am just gonna log it: ', error);
    })
  }

function buildResponse(statusCode, body){
    return {
        statusCode:statusCode,
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    }
}

