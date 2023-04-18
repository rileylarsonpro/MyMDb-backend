const express = require('express');
const cors = require('cors');
const { hasUser } = require(`./middleware/hasUser`)
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();

// adding Helmet to enhance API's security
app.use(helmet());

app.use(cors({
    origin: '*',
    credentials: true,
}))
app.use(morgan(`dev`))
app.use(express.urlencoded({ extended: false }))
 

// Configuring Swagger
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
 *   title: The MyMDb API
 *   version: 1.0.0
 * servers:
 *   - url: http://localhost:3004/api/v1
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
app.use('/api/v1/user/file', require('./routes/fileUpload.routes.js'))
app.use(express.json())
app.use('/api/v1/user', require('./routes/user.routes.js'))
app.use('/api/v1/media', hasUser, require('./routes/media.routes.js'))
app.use('/api/v1/log', hasUser, require('./routes/log.routes.js'))
app.use('/api/v1/tag', hasUser, require('./routes/tag.routes.js'))

//end define routes

module.exports = app;