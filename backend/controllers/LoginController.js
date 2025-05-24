import Login from "../models/LoginModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const Register = async (req, res) => {
  const { username, password, confPassword } = req.body;
  if (password !== confPassword)
    return res.status(400).json({ msg: "Konfirmasi password tidak cocok!" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Login.create({
      username,
      password: hashPassword,
    });
    res.json({ msg: "Register berhasil" });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// LOGIN
export const LoginUser = async (req, res) => {
  console.log("Login attempt received for username:", req.body.username);
  try {
    const user = await Login.findOne({
      where: { username: req.body.username }
    });

    if (!user) {
      console.log("User not found for username:", req.body.username);
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      console.log("Password mismatch for username:", req.body.username);
      return res.status(400).json({ msg: "Password salah" });
    }

    const userId = user.id;
    const username = user.username; // Username ini yang perlu dikirim

    console.log("User authenticated:", username);

    const accessToken = jwt.sign({ userId, username }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h'
    });

    const refreshToken = jwt.sign({ userId, username }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d' // 1 hari
    });

    await Login.update({ refresh_token: refreshToken }, { where: { id: userId } });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 hari
    });

    console.log("Sending successful login response with accessToken:", accessToken, "and username:", username);
    // PERBAIKAN PENTING: Kirimkan accessToken DAN username
    res.json({ accessToken, username }); // <-- PERBAIKAN DI SINI!

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// LOGOUT
export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await Login.findOne({
    where: { refresh_token: refreshToken }
  });

  if (!user) return res.sendStatus(204);

  const userId = user.id;
  await Login.update({ refresh_token: null }, {
    where: { id: userId }
  });

  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const user = await Login.findOne({
    where: { refresh_token: refreshToken }
  });

  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ accessToken });
  });
};
