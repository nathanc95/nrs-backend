import DB from "./postgre/db";

export default class StateRepository {
    constructor(private dbConnection: DB) {
        this.dbConnection = dbConnection;
    }

    async fetchAllStates() {
        console.debug('trying to retrieve all the states from the database');
        try {
            const query = `select id, state from states;`;
            const res = await this.dbConnection.any(query, []);
            console.debug({res});
            return res;
        } catch (err) {
            throw err;
        }
    }
}
