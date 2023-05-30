import { db } from "../connect.js";
import jwt from "jsonwebtoken";

const verifyFunc = (req, res) => {
  let userInfoId = "";
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    userInfoId = userInfo.id;
  });
  return userInfoId;
};

export const getRelation = (req, res) => {
  const followedUserId = req.query.followedUser;
  let userInfoId = verifyFunc(req, res);
  const q =
    "SELECT followerUserId FROM relationships WHERE followedUserId = ? ";
  db.query(q, followedUserId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const postRelation = (req, res) => {
  const followedUserId = req.query.followedUser;
  let userInfoId = verifyFunc(req, res);
  const q =
    "INSERT INTO relationships(`followerUserId`, `followedUserId`) VALUES (?)";
  const values = [userInfoId, followedUserId];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("relationship gui thanh cong");
  });
};

export const deleteRelation = (req, res) => {
  const followedUserId = req.query.followedUser;
  let userInfoId = verifyFunc(req, res);
  const q = `DELETE FROM relationships WHERE followedUserId = ? AND followerUserId = ${userInfoId} `;

  db.query(q, followedUserId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("XOA relationship thanh cong");
  });
};
