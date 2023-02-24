const mongoose = require('mongoose');
require('dotenv').config();

// Only variables in schemas will be saved to the database
mongoose.set('strictQuery', true); 

// Create connection to MONGO using .env variable
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Error handling
var db = mongoose.connection;
db.on('error', error => console.error(error.message));
// Callback function
db.once('open', function() {
  // We're connected!
  console.log("MongoDB connected!")
});

module.exports = db;