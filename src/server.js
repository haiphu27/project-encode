const express = require('express')
const app = express()
const cors = require("cors");
require('dotenv').config()
const {redisClient} = require('./config/connect-redis');
const load_router = require('./loadfile/load-router')
const load_model = require('./loadfile/load-model')
const {sequelize} = require('./config/connect-mysql')

sequelize.authenticate().then(async () => {
    await load_model(sequelize)
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

redisClient.connect()
    .then(() => {
        console.log('connected to Redis server')
    })
    .catch(err => console.error(err))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

load_router(app)

const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
    console.log("You are listening on http://localhost:" + PORT)
})