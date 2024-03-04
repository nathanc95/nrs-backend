const path = require('path');
const dbConnection = require('../repository/postgre/db');
const pgp = require('pg-promise')();
const dbMigrateUtils = require('./dbMigrateUtils');

// States Data
const jsonObjects = require('../assets/UsaStates.json');
const {query} = require("express");

class Migrate {
    async verifyStructure() {
        let validTables = {
            state: false,
            counties: false
        };
        const checkCountieQuery = `select count(id) from counties`;
        const checkStateCountieQuery = `select count(id) from states`;

        const resCheckCountie = await dbConnection.oneOrNone(checkCountieQuery);
        if (resCheckCountie !== undefined && parseInt(resCheckCountie.count, 10) > 0) {
            validTables.counties = true;
        }

        const resCheckState = await dbConnection.oneOrNone(checkStateCountieQuery);
        if (resCheckState !== undefined && parseInt(resCheckState.count, 10) > 0) {
            validTables.state = true;
        }

        return validTables;
    }

    async initTables() {
        const query = `    
        CREATE TABLE IF NOT EXISTS states
        (
            id         SERIAL PRIMARY KEY,
            state       varchar(70)  not null unique,
            population int          not null,
            counties   int          not null,
            detail     varchar(250) null
        );
        
        
        CREATE TABLE IF NOT EXISTS counties
        (
            id         SERIAL PRIMARY KEY,
            county     varchar(100) not null,
            population int          not null,
            stateId    int,
            CONSTRAINT fk_stateId
                FOREIGN KEY (stateId)
                    REFERENCES states (id)
        );`

        await dbConnection.query(query);
    }

    async massStateInsert() {
        const template = pgp.helpers.insert(jsonObjects, ['state', 'population',
            'counties', 'detail'], 'states');
        await dbConnection.query(template);
    }

    async massCountiesInsert(countiesContent) {
        // first we need to select all the states to get the state id
        const fetchAllStatesQuery = `select id, state from states`;
        const fetchStateAll = await dbConnection.any(fetchAllStatesQuery);

        let mergedCounties = [];
        countiesContent.map((countie) => {
            const stateName = countie.stateName;
            const stateId = fetchStateAll.filter((state) => state.state.replace(/ /g,'').toLowerCase() === stateName.toLowerCase())
            countie.countiesData.map((data) => {
                data.stateid = stateId[0].id;
                mergedCounties.push(data);
            });
        });
        const template = pgp.helpers.insert(mergedCounties, ['county', 'population', 'stateid'], 'counties');
        await dbConnection.query(template);
    }

    async init() {
        console.debug('setting up the database');
        // Call the function to insert the JSON array into the table
        try {
            const existTables = await this.verifyStructure();

            // first we need to create the tables
            await this.initTables();
            // // second we need to insert the state values into the tables if not already done
            if (!existTables.state) {
                await this.massStateInsert();
            }
            // // third we need to add the counties into the tables uf not already done
            if (!existTables.counties) {
                await this.massCountiesInsert(dbMigrateUtils.requireJsonFiles(dbMigrateUtils.jsonCountiesData));
            }
            console.debug('done setting up the database');
        } catch (err) {
            return err
        }
    }
}

new Migrate().init();

module.exports = new Migrate();

