import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const check = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    return res.status(200).json(userInfo);
  });
};

export const register = (req, res) => {
  //check xem user co ton tai?
  const q = "SELECT * FROM user WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err); //lỗi này là để hiển thị lỗi nếu việc đẩy data từ form lên có lỗi
    if (data.length) {
      return res.status(409).json("da ton tai username nay");
      // if (checkData) {
      //   console.log(checkData);
      //   return;
      // }
    }

    //tao user moi
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt); // hassed đòng bộ. tức là hass xong mới chạy câu lệnh tiếp sau đó

    console.log(hashedPassword);
    const q_insert =
      "INSERT INTO user( username, email, password, name) VALUES (?,?,?,?)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(q_insert, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Create user success ");
    });
  }); //nếu không có lỗi và data trả về có length thì lkaf có tồn tại 1 data rồi sẽ gửi lại thông baops đã tồn tại user
};

export const login = (req, res) => {
  const q = "SELECT * FROM user WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) {
      return res.status(404).json("User not found");
    }

    const checkedPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkedPassword) {
      return res.status(400).json("Worng pass or username");
    } else {
      //neu user dang nhap thanh cong se trả lại cho user 1 token để ng dùng có thể duy trì trạng thái đăng nhập của mình
      // ở đây thứ dk mã hóa token sẽ là id vì id là thứ duy nhất để định danh user
      const token = jwt.sign({ id: data[0].id }, "secretKey"); //token se mang infor cua user dk ma hoa
      //vieecj gasn biến này để đảm bảo ta k gửi toàn bộ data[0](bao gồm cả pass) tới cho ng dùng
      const { password, ...others } = data[0];

      res.cookie("accessToken", token, { httpOnly: true });

      return res.status(200).json(others);
    }
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", { secure: true, sameSite: "none" })
    .status(200)
    .json("user logout");
};
