const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
var morgan = require('morgan');
const multer = require('multer');
const connectDb = require('./controllers/db.js');
const app = express();
connectDb();





app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});