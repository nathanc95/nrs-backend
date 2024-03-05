const dbConnection = require("./postgre/db");

module.exports = class StateRepository {
    dbConnection = null;

    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    async fetchAllStates() {
        console.debug('trying to retrieve all the states from the database');
        try {
            const query = `select id, state from states;`;
            const res = await dbConnection.any(query);
            console.debug({res});
            return res;
        } catch (err) {
            throw err;
        }
    }
}
