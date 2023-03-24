const app = require('./app');
require('./config/db.connect');
require('./config/firebase.config');

//start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on ${port}`);
});