import express from 'express';
import cors from 'cors';

import StateRepository from './repository/stateRepository';

import DB from './repository/postgre/db';

import Migrate from './db_migration/migrate';

import CountryController from './controller/countryController';

const PORT = process.env.PORT || 8000;
const app = express();

// Enable CORS with custom options
app.use(
    cors({
        origin: '*', // Specify the allowed origin (Vue.js app)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Allow credentials (cookies, HTTP authentication) to be sent to the server
    })
);

app
    .get('/state', async (req: any, res: any) => {
        try {
            // First, we need to insert data and set up the database
            const databaseConnection = new DB();
            const migrate = new Migrate(databaseConnection);
            await migrate.main();

            const stateRepository = new StateRepository(databaseConnection);
            const fetchAllDataRes = await stateRepository.fetchAllStates();
            return res.send(fetchAllDataRes);
        } catch (err) {
            console.error(err);
            return res.send(
                JSON.stringify({
                    success: false,
                    errorMessage: 'Unable to retrieve all the states',
                })
            );
        }
    })
    .get('/country/:id', async (req: any, res: any) => {
        try {
            const countryController = new CountryController();
            return countryController.getCountryById(req, res);
        } catch (err) {
            console.error(err);
            return res.send(
                JSON.stringify({
                    success: false,
                    errorMessage: 'Unable to retrieve all the states',
                })
            );
        }
    })
    .listen(PORT, async () => {
        console.log(`Listening on ${PORT}`);
    });
