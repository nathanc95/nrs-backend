const express = require('express');
const PORT = process.env.PORT || 8080;
const cors = require('cors');

const StateRepository = require('./repository/stateRepository');
const dbConnection = require("./repository/postgre/db");

const Migrate = require('./db_migration/migrate');
const CountyService = require('./services/countyService');
const CountyRepository = require("./repository/countyRepository");

const app = express();
const databaseConnection = dbConnection.createConnection();

// Enable CORS with custom options
app.use(cors({
    origin: 'http://localhost:5174', // Specify the allowed origin (Vue.js app)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, HTTP authentication) to be sent to the server
}));

app
    .get('/state', async (req, res) => {
        try {
            const stateRepository = new StateRepository(databaseConnection);
            const fetchAllDataRes = await stateRepository.fetchAllStates();
            return res.send(fetchAllDataRes);
        } catch (err) {
            console.error(err);
            return res.send(JSON.stringify({
               "success": false,
               "errorMessage": "unable to retrieve all the states"
            }));
        }
    })
    .get('/county/:id', async (req, res) => {
        try {
            const countyId = parseInt(req.params.id, 10);

            if (isNaN(countyId)) {
                return res.send({
                    "success": false,
                    "errorMessage": "invalid county provided"
                });
            }

            const countyRepository = new CountyRepository(databaseConnection);
            const countyService = new CountyService(countyRepository);
            const resMainCounty = await countyService.mainCounty(countyId);
            return res.send(resMainCounty);
        } catch (err) {
            console.error(err);
            return res.send(JSON.stringify({
                "success": false,
                "errorMessage": "unable to retrieve all the states"
            }));
        }
    })
    .listen(PORT, async() => {
        try {
            const migrate = new Migrate(databaseConnection);
            await migrate.main();
        } catch (err) {
            console.error('unable to set up the database', err);
        }
        console.log(`Listening on ${PORT}`)
    });
