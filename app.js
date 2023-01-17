const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');


const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(cors({origin: '*'}));

// adding morgan to log HTTP requests
app.use(morgan('combined'));



//Configuring Swagger
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "MyMDb API",
        version: "1.0.0",
        description: "API for MyMDb",
      },
      servers: [
        {
          url: `${process.env.HOST}:${process.env.PORT}/api`
        }
      ]
    },
    apis: ["./routes/*.js", './*.js', './models/*.js']
  }  
const specs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: The Lowdown Utah API
 *   version: 1.0.0
 * servers:
 *   - url: http://localhost:3004/api
 *     description: 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       description: "JWT Authorization header using the Bearer scheme."
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: "No authorization token was found or token is invalid"
 *     Forbidden:
 *       description: "Insufficient scope"
 *     Error:
 *       description: "Internal Server Error"
 *     BadInput:
 *       description: "One or more items in the provided input is invalid"
 */

//end swagger config


//define routes 

//end define routes

module.exports = app;