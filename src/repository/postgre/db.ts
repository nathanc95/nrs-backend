const pgp = require('pg-promise')();
const dotenv = require('dotenv');

export default class DB {
    createConnection() {
        dotenv.config();
        const connection = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            schema: 'nrs'
        };
        return pgp(connection);
    }

    /**
     *
     * @returns {Promise<*>}
     */
    async query(template: string) {
        const conn = this.createConnection();
        try {
            return await conn.none(template);
        }
        catch (err) {
            return err;
        }
        finally {
            pgp.end();
        }
    }

    async oneOrNone(query: string) {
        const conn = this.createConnection();
        try {
            return await conn.oneOrNone(query);
        }
        catch (err) {
            return err;
        }
        finally {
            pgp.end();
        }
    }

    async any(query: string, values: Array<any>) {
        const conn = this.createConnection();
        try {
            return await conn.any(query, values);
        }
        catch (err) {
            return  err;
        }
        finally {
            pgp.end();
        }
    }
}
