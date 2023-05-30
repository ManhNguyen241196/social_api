import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken; // lay token tu req. Khi gửi req lên link server thì việc các thông tin, biến gửi request đó ngoià đường link được gửi từ
  //browser lên sẽ được gửi kèm theo cookies. Và lúc này coockies có chứa object có key là accessToken

  if (!token) return res.status(401).json("Not logged in!"); // nếu token này k có thì chưa được login thành công

  jwt.verify(token, "secretKey", (err, userInfo) => {
    // nếu có token nhưng verify lỗi thì là token hết hạn
    if (err) return res.status(403).json("Token is not valid!");
    // cả 2 điều kiện với token trên đều trả lại lỗi return luôn và sẽ k chạy phần code sau return nữa.
    //verify nếu trả lại k lỗi thì sẽ trả lại toàn bộ giá trị của token trước khi được mã hóa. Giá trị gốc.

    // const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN user AS u ON (u.id = p.userId)`;
    const q = `SELECT DISTINCT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN user AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? `;
    // const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];
    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      // ở đây [userInfo.id] chính là biến được gửi kèm với query của SQL để thực hiện câu lệnh q.
      // ở đây userInfor.id được triasch xuất từ chính lượng data được mã hóa ẩn phía sau token ở cookies
      if (err) return res.status(500).json(err);
      return res.status(200).json(data); // return  này sẽ trả lại các data dạng json của hàm getPosts
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`desc`, `img`, `createAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};
