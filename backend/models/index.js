import db from "../config/Database.js";
import User from "./UserModel.js";   
import Login from "./LoginModel.js"; 

Login.hasMany(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.belongsTo(Login, { foreignKey: "userId" });

(async () => {
  try {
    await db.authenticate();
    console.log("✅ Koneksi database berhasil!");
    await db.sync({ alter: true });
    console.log("✅ Semua tabel berhasil disinkronisasi.");
  } catch (err) {
    console.error("❌ Gagal koneksi DB:", err);
  }
})();

export { User, Login };
