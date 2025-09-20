const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'Movie Rating API',
        description: 'Simple API to rate movies'
    },
    host: '',
    schemes: '[https]'
}

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointFiles, doc);