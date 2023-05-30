import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
  });

  const q = " SELECT * FROM user WHERE id = ?";
  db.query(q, userId, (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length > 0) {
      const { password, ...infor } = data[0];
      return res.status(200).json(infor);
    }
    return res.status(404).json("User not found");
  });
};

export const updateUser = (req, res) => {
  const userId = req.params.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
  });

  const q =
    "UPDATE user SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

  const values = [
    req.body.name,
    req.body.city,
    req.body.website,
    req.body.coverPic,
    req.body.profilePic,
    userId,
  ];

  db.query(q, [...values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("update thanh cong thong tin moi");
  });
};
