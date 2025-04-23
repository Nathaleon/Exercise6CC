import {Sequelize} from "sequelize";

const db = new Sequelize('RECOVER_YOUR_DATA', 'root', '', {
    host: '34.50.76.140',
    dialect: 'mysql'
});

export default db;
