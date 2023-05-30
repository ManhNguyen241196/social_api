import express from "express";
const app = express();
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import postRoutes from "./routes/posts.js";
import relateRoutes from "./routes/relationship.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

//middlewares xac thuc truoc khi cho phep sử dụng các đường link bên dưới nó.
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

//qua trình lưu file vừa upo lên vào 1 store được tạo bởi nội bộ server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // một trong các giá trị của File information, Nó chính là tên file mà được uplaod lên input
    // file information chính là các thông tin của file đang upload có thể khai thác mà multer cung cấp. BẢn chất của multer nếu sử dụng disk storage
    //chính là copy chúng link này sang link khác.
  },
});

const upload = multer({ storage: storage });

app.use(cookieParser());

app.post("/api/upload", upload.single("file"), (req, res) => {
  // cấu trúc của .single () chính là .single(fieldname). fieldname chính là
  //name của input file ở trên form khi gửi. Ở đây vì fornt end được gửi dưới dạng 1 formdata
  //được tạo mới nên đầu vào của nó là 1 object nhưng bản chất là 1input có fieldname và value đính kèm.
  const file = req.file;
  res.status(200).json(file.filename); //file.filename ở đây chish là tên mới của file đó được lưu ở đích đến mới. CÒn tại nơi gốc mà upload lên file đó
  // đã được chuyển thành giá trị file ở input multer đã là nhiệm vụ tải file tỏng input về 1 link lư trữ và đổi tên file đó thành file mới.
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/relationship", relateRoutes);

app.get("/", (req, res) => {
  res.send("Hello, waaaaaaaorld!");
});
app.listen(8080, () => {
  console.log("Server listening on port 8080.");
});
