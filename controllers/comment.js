import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const postId = req.query.postId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN user AS u ON (u.id = c.userId)
      LEFT JOIN posts AS p ON (p.id = c.postId) WHERE c.postId= ? `;
    db.query(q, [postId], (err, data) => {
      // ở đây [userInfo.id] chính là biến được gửi kèm với query của SQL để thực hiện câu lệnh q.
      // ở đây userInfor.id được triasch xuất từ chính lượng data được mã hóa ẩn phía sau token ở cookies
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const postComments = (req, res) => {
  let userInfoId = "";
  const postId = req.query.postId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    userInfoId = userInfo.id;
  });

  const q =
    "INSERT INTO comments(`desc`, `createAt`, `userId`, `postId`) VALUES (?)";

  const values = [
    req.body.description,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    userInfoId,
    postId,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("post thanh cong cmt");
  });
};
