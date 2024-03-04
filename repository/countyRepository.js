const dbConnection = require("./postgre/db");

class CountryRepository {
    fetchCountiesPerNameQuery = `
        select c.id, c.county, c.population, c.statename
        from counties as c
        where LOWER(statename) = $1`

    fetchSumOfPopulationsPerCountyQuery = `
        select sum(c.population) as sumCountyPopulation, s.population as statePopulation
        from counties as c
        inner join states as s on s.state = c.statename
        where LOWER(statename) = $1
        group by s.population
    `;

    async fetchCountyPerState(stateName) {
        console.debug('trying to retrieve all the county for state: ', stateName);
        try {
            const res = await dbConnection.any(this.fetchCountiesPerNameQuery, [stateName.toLowerCase()]);
            console.debug({res});
            return res;
        } catch (err) {
            throw err;
        }
    }

    async fetchSumOfPopulationsPerCounty(stateName) {
        console.debug('trying to retrieve the sum of populations for state: ', stateName);
        try {
            const res = await dbConnection.any(this.fetchSumOfPopulationsPerCountyQuery, [stateName.toLowerCase()]);
            console.debug({res});
            return res;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new CountryRepository();
