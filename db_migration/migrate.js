const path = require('path');
const dbConnection = require('../repository/postgre/db');
const pgp = require('pg-promise')();
const dbMigrateUtils = require('./dbMigrateUtils');

// States Data
const jsonObjects = require('../assets/UsaStates.json');

class Migrate {
    async verifyStructure() {
        let validTables = {
            state: false,
            counties: false
        };
        const query = `
        select (select count(id) from counties) as countCounties, (select count(id) from states) as countStates;`;
        const res = await dbConnection.oneOrNone(query);

        if (parseInt(res.countcounties, 10) > 0) {
            validTables.counties = true;
        }

        if (parseInt(res.countstates, 10) > 0) {
            validTables.state = true;
        }

        return validTables;
    }

    requireJsonFiles(filePaths) {
        return filePaths.map(filePath => {
            try {
                let statePath = path.resolve(filePath).split("/");
                let stateName = path.resolve(filePath)
                    .split("/")[statePath.length - 1]
                    .replace('.json', '');
                const countiesData = require(filePath);
                return {
                    stateName,
                    countiesData
                }
            } catch (error) {
                console.error(`Error requiring file:`, error);
                return null;
            }
        });
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
            county       varchar(100) not null,
            population int          not null,
            stateName  varchar(70)  not null
        );`

        await dbConnection.query(query);
    }

    async massStateInsert() {
        const template = pgp.helpers.insert(jsonObjects, ['state', 'population',
            'counties', 'detail'], 'states');
        await dbConnection.query(template);
    }

    async massCountiesInsert(countiesContent) {
        let mergedCounties = [];
        countiesContent.map((countie) => {
            const stateName = countie.stateName;
            countie.countiesData.map((data) => {
                data.statename = stateName;
                mergedCounties.push(data);
            });
        });
        const template = pgp.helpers.insert(mergedCounties, ['county', 'population', 'statename'], 'counties');
        await dbConnection.query(template);
    }

    async init() {
        console.debug('setting up the database');
        // Call the function to insert the JSON array into the table
        try {
            const existTables = await this.verifyStructure();
            // first we need to create the tables
            await this.initTables();
            // second we need to insert the state values into the tables if not already done
            if (!existTables.state) {
                await this.massStateInsert();
            }
            // third we need to add the counties into the tables uf not already done
            if (!existTables.counties) {
                await this.massCountiesInsert(this.requireJsonFiles(dbMigrateUtils.jsonCountiesData));
            }
            console.debug('done setting up the database');
        } catch (err) {
            return err
        }
    }
}

module.exports = new Migrate();

