import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token:", token);

  if (!token) return res.status(401).json({ message: "Unauthorized, token missing" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification error:", err.message);
      return res.status(403).json({ message: "Forbidden, token invalid" });
    }
    req.userId = decoded.userId;
    req.username = decoded.username;
    console.log("Decoded token payload:", decoded);
    next();
  });
};

