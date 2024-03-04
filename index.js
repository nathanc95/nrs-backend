const express = require('express');
const PORT = process.env.PORT || 6000;
const dbMigration = require('./db_migration/migrate');
express()
    .get('/', async (req, res) => {
        try {

        } catch (err) {
            console.error(err);
        }
        res.send('done');
    })
    .get('/events', async (req, res) => {
        try {

        } catch (err) {
            console.error(err);
        }
        res.send('done');
    })
    .get('/listEvent', async (req, res) => {
        try {

        } catch (err) {
            console.error(err);
        }
        res.send('list done');
    })

    .listen(PORT, async() => {
        try {
            await dbMigration.init();
        } catch (err) {
            console.error('unable to set up the database', err)
        }
        console.log(`Listening on ${PORT}`)
    });
