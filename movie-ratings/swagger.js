const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: { title: 'Movie Ratings API', version: '1.0.0' },
    description: 'Simple API to rate movies',
    host: 'movierating-wakw.onrender.com',
    basePath: '/',
    schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointFiles, doc);