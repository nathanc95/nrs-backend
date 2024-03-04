const express = require('express');
const PORT = process.env.PORT || 8080;
const dbMigration = require('./db_migration/migrate');
const stateRepository = require('./repository/stateRepository');
const countyRepository = require('./repository/countyRepository');
const countyService = require('./services/countyService');
const cors = require('cors');

const app = express();

// Enable CORS with custom options
app.use(cors({
    origin: 'http://localhost:5174', // Specify the allowed origin (Vue.js app)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, HTTP authentication) to be sent to the server
}));

app
    .get('/state', async (req, res) => {
        try {
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
    .get('/county/:name', async (req, res) => {
        try {
            const countyName = req.params.name;
            countyService.init(countyRepository);
            const resMainCounty = await countyService.mainCounty(countyName);
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
            await dbMigration.init();
        } catch (err) {
            console.error('unable to set up the database', err);
        }
        console.log(`Listening on ${PORT}`)
    });
