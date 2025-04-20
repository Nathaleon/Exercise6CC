import {Sequelize} from "sequelize";

const db = new Sequelize('exc5', 'root', '', {
    host: '34.50.76.140',
    dialect: 'mysql'
});

export default db;