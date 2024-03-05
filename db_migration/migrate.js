const dbMigrateUtils = require('./dbMigrateUtils');
const { helpers } = require('pg-promise')();
// States Data
const jsonObjects = require('../assets/usaStates.json');

module.exports = class Migrate {
    dbConnection = null;

    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    async verifyStructure() {
        console.debug('init the structure');
        let validTables = {
            state: false,
            counties: false
        };
        const checkCountieQuery = `select count(id) from counties`;
        const checkStateCountieQuery = `select count(id) from states`;

        try {
            const resCheckCountie = await this.dbConnection.oneOrNone(checkCountieQuery);
            if (resCheckCountie !== undefined && parseInt(resCheckCountie.count, 10) > 0) {
                validTables.counties = true;
            }
        } catch (err) {}

        try {
            const resCheckState = await this.dbConnection.oneOrNone(checkStateCountieQuery);
            if (resCheckState !== undefined && parseInt(resCheckState.count, 10) > 0) {
                validTables.state = true;
            }
        } catch (err) {}

        console.debug('done init the structure');
        return validTables;
    }

    async initTables() {
        console.debug('trying to init the tables');
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

        await this.dbConnection.query(query);
        console.debug('done init the tables');
    }

    async massStateInsert() {
        console.debug('massStateInsert');
        const template = helpers.insert(jsonObjects, ['state', 'population',
            'counties', 'detail'], 'states');
        await this.dbConnection.query(template);
    }

    async massCountiesInsert(countiesContent) {
        console.debug('massCountiesInsert');
        // first we need to select all the states to get the state id
        const fetchAllStatesQuery = `select id, state from states`;
        const fetchStateAll = await this.dbConnection.any(fetchAllStatesQuery);

        let mergedCounties = [];
        countiesContent.map((countie) => {
            const stateName = countie.stateName;
            const stateId = fetchStateAll.filter((state) => state.state.replace(/ /g,'').toLowerCase() === stateName.toLowerCase())
            countie.countiesData.map((data) => {
                data.stateid = stateId[0].id;
                mergedCounties.push(data);
            });
        });
        const template = helpers.insert(mergedCounties, ['county', 'population', 'stateid'], 'counties');
        await this.dbConnection.query(template);
    }

    async main() {
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

