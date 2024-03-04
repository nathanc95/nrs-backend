const express = require('express');
const PORT = process.env.PORT || 6000;
const dbMigration = require('./db_migration/migrate');
const stateRepository = require('./repository/stateRepository');
const countyRepository = require('./repository/countyRepository');
const countyService = require('./services/countyService');

express()
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
