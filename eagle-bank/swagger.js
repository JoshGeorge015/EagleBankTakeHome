import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Eagle Bank API',
    description: 'Auto-generated Swagger docs for Eagle Bank',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js']; 

swaggerAutogen()(outputFile, endpointsFiles, doc);