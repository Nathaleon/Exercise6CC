import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  'users',
  {
    name: DataTypes.STRING,
    title: DataTypes.STRING, 
    isi_notes: DataTypes.TEXT, 
    date_created: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
    },
  },
  {
    freezeTableName: true,
    timestamps: false, 
  }
);

export default User;

(async () => {
  await db.sync();
})();