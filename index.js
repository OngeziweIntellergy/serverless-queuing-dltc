const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const util = require('./utils/utils');
// const cors = require('cors')
// const corsOptions ={
//   origin:'*', 
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

// app.use(cors(corsOptions));

module.exports.handler = async (event) => {
  console.log('request event', event);
  try {
    let response;

    if (event.httpMethod === 'GET' && event.path === healthPath) {
      response = util.buildResponse(200);
    } else if (event.httpMethod === 'POST' && event.path === healthPath) {
      response = util.buildResponse(200);
    } else if (event.httpMethod === 'POST' && event.path === registerPath) {
      const registerBody = JSON.parse(event.body);
      response =  await registerService.register(registerBody);
    } else if (event.httpMethod === 'POST' && event.path === loginPath) {
      const loginBody = JSON.parse(event.body);
      response =  loginService.login(loginBody);
    } else if (event.httpMethod === 'POST' && event.path === verifyPath) {
      const verifyBody = JSON.parse(event.body);
      response = verifyService.verify(verifyBody);
    } else {
      response = util.buildResponse(404, '404 not found!');
    }

    return response || util.buildResponse(500, 'Internal Server Error');
  } catch (error) {
    console.error('Error processing request', error);
    return util.buildResponse(500, 'Internal Server Error');
  }
};
