const dotenv = require('dotenv')
dotenv.config();

const express = require("express")
const app = express()

const connectToDb = require("./db/db.js")
connectToDb();

const cors = require('cors')
app.use(cors())
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use('/users', userRoutes);
app.use('/captains',captainRoutes);


module.exports = app;