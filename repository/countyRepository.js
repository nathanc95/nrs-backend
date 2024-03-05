module.exports = class CountryRepository {
    dbConnection = null;

    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    fetchCountiesPerNameQuery = `
        select c.id, c.county, c.population, c.stateid, s.state
        from counties as c
        inner join states as s on s.id = c.stateid
        where stateid = $1`

    fetchSumOfPopulationsPerCountyQuery = `
        select sum(c.population) as sumCountyPopulation, s.population as statePopulation
        from counties as c
        inner join states as s on s.id = c.stateid
        where stateid = $1
        group by s.population
    `;

    async fetchCountyPerState(stateId) {
        console.debug('trying to retrieve all the county for state: ', stateId);
        try {
            const res = await this.dbConnection.any(this.fetchCountiesPerNameQuery, [stateId]);
            console.debug({res});
            return res;
        } catch (err) {
            throw err;
        }
    }

    async fetchSumOfPopulationsPerCounty(stateId) {
        console.debug('trying to retrieve the sum of populations per county: ', stateId);
        try {
            const res = await this.dbConnection.any(this.fetchSumOfPopulationsPerCountyQuery, [stateId]);
            console.debug({res});
            return res;
        } catch (err) {
            throw err;
        }
    }
}
