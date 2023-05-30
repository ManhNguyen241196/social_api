import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = " SELECT userId  FROM likes WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

export const postLikes = (req, res) => {
  let userInfoId = "";
  const postId = req.query.postId;
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    userInfoId = userInfo.id;
  });

  const q = " INSERT INTO likes (`userId`, `postId`) VALUES (?)";
  const values = [userInfoId, postId];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("like thanh cong cmt");
  });
};

export const deleteLikes = (req, res) => {
  let userInfoId = "";
  const postId = req.query.postId;
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    userInfoId = userInfo.id;
  });

  const q = ` DELETE FROM likes WHERE postId = ? AND userId = ${userInfoId}`;

  db.query(q, postId, (err, data) => {
    if (err) return res.status(500).json(err);
    console.log(data);
    return res.status(200).json("xoa thanh cong like nay");
  });
};
