function buildResponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'credentials':true,
      },
      body: JSON.stringify(body || {})
    };
  }
  module.exports.buildResponse = buildResponse