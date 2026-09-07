//replace below part with this commented and add this part at deployment time

// import os from "os";

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: os.tmpdir(),
//     limits: {
//       fileSize: parseInt(MAX_FILE_SIZE),
//     },
//   }),
// );

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnect } from "./configs/Database.js";
import { cloudinaryConnect } from "./configs/Cloudinary.js";
import Auth from "./routes/Auth.js";
import User from "./routes/User.js";
import Product from "./routes/Product.js";
import Category from "./routes/Category.js";
import Order from "./routes/Order.js";
import Cart from "./routes/Cart.js";
import { ENV } from "./configs/Env.js";
import dns from "node:dns"; 
import { errorMiddleware } from "./middlewares/error.js";
import helmet from "helmet";
import { FILE_CONFIG } from "./constants/fileConfig.js";
import { successResponse } from "./utils/helpers/response.js";

const { NODE_ENV, FRONTEND_URL } = ENV;
const { MAX_FILE_SIZE } = FILE_CONFIG;
const PORT = ENV.PORT || 5000;
const app = express();

if (NODE_ENV === "development") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

dbConnect();
cloudinaryConnect();

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp",
    limits: { fileSize: MAX_FILE_SIZE },
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", Auth);
app.use("/api/v1/user", User);
app.use("/api/v1/product", Product);
app.use("/api/v1/category", Category);
app.use("/api/v1/cart", Cart);
app.use("/api/v1/order", Order);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});

app.get("/", (req, res) => {
  return successResponse(res, { message: "Api is running" });
});