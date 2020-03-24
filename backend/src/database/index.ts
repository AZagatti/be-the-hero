import knex from "knex";

import configuration from "../../knexfile";

const connection = knex(configuration.development);

export default connection;
