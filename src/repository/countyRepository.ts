import DB from "./postgre/db";

export default class CountryRepository {
    constructor(private dbConnection: DB) {
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

    async fetchCountyPerState(stateId: number): Promise<any> {
        console.debug(`trying to retrieve all the country for state: ${ stateId }`);
        try {
            return await this.dbConnection.any(this.fetchCountiesPerNameQuery, [stateId]);
        } catch (err) {
            throw err;
        }
    }

    async fetchSumOfPopulationsPerCounty(stateId: number): Promise<any> {
        console.debug(`trying to retrieve the sum of populations per country: ${stateId}`);
        try {
            return await this.dbConnection.any(this.fetchSumOfPopulationsPerCountyQuery, [stateId]);
        } catch (err) {
            throw err;
        }
    }
}
