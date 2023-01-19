const express = require('express');
const expressSession = require(`express-session`)
const passport = require('passport')
const cookieParser = require(`cookie-parser`)
const cors = require('cors');
const { authenticate } = require(`./middleware/authenticated`)
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const store = require(`./config/passport`)(expressSession)

const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}))// CORS will allow a front end specified in the .env to have access to restricted resources.
app.use(morgan(`dev`)) // This line is for having pretty logs for each request that your API receives.
app.use(express.json()) // This line says that if a request has a body, that your api should assume it's going to be json, and to store it in req.body
app.use(express.urlencoded({ extended: false })) // this line says that if there's any URL data, that it should not use extended mode.
app.use(cookieParser()) // This line says that if there are any cookies, that your app should store them in req.cookies
 
const session = {
    name: `MyMDb_session`,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // A month long cookie
    }
}
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    session.cookie.secure = true // serve secure cookies
    session.cookie.sameSite = 'none'
}

app.use(expressSession(session))

app.use(passport.initialize())
app.use(passport.session())


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
app.use('/api/v1/auth', require('./routes/auth'))

//end define routes

module.exports = app;