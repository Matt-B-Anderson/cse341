const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'My API',
        description: 'Contacts API'
    },
    host: 'https://cse341-o8bq.onrender.com',
    schemes: '[https]'
}

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

//swaggerAutogen(outputFile, endpointFiles, doc);