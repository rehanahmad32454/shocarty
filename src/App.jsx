// profile icon
// CgProfile

// add product
// AiOutlinePlusCircle

// view all product
// MdOutlineInventory2

// edit product
// FiEdit

// logout user
// FiLogOut

// cart
// IoCartOutline

// orders
// LuShoppingBag

//setting
// IoSettingsOutline

//search
// IoSearch

import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgetPassword from "./pages/ForgetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import OpenRoute from "../src/components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { AddProduct } from "./components/core/dashboard/AddProduct";
import ViewAllProduct from "./components/core/dashboard/ViewAllProduct/ViewAllProduct";
import { EditProduct } from "./components/core/dashboard/EditProduct";
import { ViewAllUsers } from "./components/core/dashboard/viewAllUsers/ViewAllUsers";
import { Profile } from "./components/core/dashboard/Settings/Profile";
import { MyProfile } from "./components/core/dashboard/MyProfile";
import { initializeCsrf } from "./services/axios";
function App() {
  useEffect(() => {
    initializeCsrf();
  }, []);

  return (
    <div className="mx-auto w-full min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<>hii</>}></Route>
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="forget-password"
          element={
            <OpenRoute>
              <ForgetPassword />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="update-password/:token?"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        ></Route>
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/myprofile" element={<MyProfile />}></Route>
          <Route path="dashboard/addproduct" element={<AddProduct />}></Route>
          <Route path="dashboard/products" element={<ViewAllProduct />}></Route>
          <Route
            path="dashboard/editproduct/:productId"
            element={<EditProduct />}
          ></Route>
          <Route path="dashboard/users" element={<ViewAllUsers />}></Route>
          <Route path="dashboard/myprofile" element={<Profile />}></Route>
          {/* <Route path="dashboard/products" element={<ViewAllProduct />}></Route> */}

          {/* <Route path="addproduct" element={< />}></Route> */}
          {/* <Route path="myprofile" element={<div className="text-black">My profile</div>} />
          <Route path="cart" element={<div className="text-black">My Cart</div>} />
          <Route path="order" element={<div className="text-black">My Order</div>} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;

// # Updated Complete Production Backend (JWT + Refresh + CSRF + RBAC)

// ## Folder Structure

// ```txt
// server/
// ├── server.js
// └── src/
//     ├── models/
//     │   └── User.js
//     ├── routes/
//     │   └── auth.routes.js
//     ├── controllers/
//     │   └── auth.controller.js
//     ├── middlewares/
//     │   ├── auth.middleware.js
//     │   ├── role.middleware.js
//     │   └── csrf.middleware.js
//     └── utils/
//         ├── tokens.js
//         └── cookies.js
// ```

// ---

// ## Install

// ```bash
// npm i express mongoose bcryptjs jsonwebtoken cookie-parser cors dotenv csrf-csrf
// ```

// ---

// ## Important CSRF Fix

// Use BOTH:

// * `generateToken()` → create/set CSRF token
// * `doubleCsrfProtection` → verify CSRF token

// This is the correct production setup.

// ---

// ## server.js

// ```js
// import express from "express";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./src/routes/auth.routes.js";

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use("/api/auth", authRoutes);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("DB Connected"))
//   .catch((err) => console.log(err));

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
// ```

// ---

// ## csrf.middleware.js

// ```js
// import { doubleCsrf } from "csrf-csrf";

// const {
//   generateToken,
//   doubleCsrfProtection,
// } = doubleCsrf({
//   getSecret: () => process.env.CSRF_SECRET || "super-secret-key",

//   cookieName: "csrfToken",

//   cookieOptions: {
//     httpOnly: false,
//     sameSite: "lax",
//     secure: process.env.NODE_ENV === "production",
//   },

//   size: 64,

//   ignoredMethods: ["GET", "HEAD", "OPTIONS"],
// });

// export {
//   generateToken,
//   doubleCsrfProtection,
// };
// ```

// ---

// ## auth.controller.js (important part)

// ```js
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// import {
//   createAccessToken,
//   createRefreshToken,
// } from "../utils/tokens.js";

// import { setCookies } from "../utils/cookies.js";

// import {
//   generateToken,
// } from "../middlewares/csrf.middleware.js";

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(400).json({
//       message: "Invalid credentials",
//     });
//   }

//   const isMatch = await bcrypt.compare(
//     password,
//     user.password
//   );

//   if (!isMatch) {
//     return res.status(400).json({
//       message: "Invalid credentials",
//     });
//   }

//   const accessToken = createAccessToken(user);
//   const refreshToken = createRefreshToken(user);

//   user.refreshToken = refreshToken;
//   await user.save();

//   setCookies(res, accessToken, refreshToken);

//   // CSRF TOKEN CREATED HERE
//   const csrfToken = generateToken(req, res);

//   return res.status(200).json({
//     message: "Login success",
//     csrfToken,
//   });
// };

// export const refresh = async (req, res) => {
//   const token = req.cookies.refreshToken;

//   if (!token) {
//     return res.status(401).json({
//       message: "No refresh token",
//     });
//   }

//   const decoded = jwt.verify(
//     token,
//     process.env.REFRESH_TOKEN_SECRET
//   );

//   const user = await User.findById(decoded.id);

//   if (!user || user.refreshToken !== token) {
//     return res.status(401).json({
//       message: "Invalid refresh token",
//     });
//   }

//   const newAccessToken = createAccessToken(user);
//   const newRefreshToken = createRefreshToken(user);

//   user.refreshToken = newRefreshToken;
//   await user.save();

//   setCookies(res, newAccessToken, newRefreshToken);

//   // CSRF TOKEN REGENERATED HERE
//   const csrfToken = generateToken(req, res);

//   return res.status(200).json({
//     message: "Token refreshed",
//     csrfToken,
//   });
// };

// export const logout = async (req, res) => {
//   const token = req.cookies.refreshToken;

//   if (token) {
//     const user = await User.findOne({
//       refreshToken: token,
//     });

//     if (user) {
//       user.refreshToken = null;
//       await user.save();
//     }
//   }

//   res.clearCookie("accessToken");
//   res.clearCookie("refreshToken");
//   res.clearCookie("csrfToken");

//   return res.status(200).json({
//     message: "Logged out",
//   });
// };
// ```

// ---

// ## auth.routes.js

// ```js
// import express from "express";

// import {
//   login,
//   refresh,
//   logout,
// } from "../controllers/auth.controller.js";

// import {
//   doubleCsrfProtection,
// } from "../middlewares/csrf.middleware.js";

// const router = express.Router();

// router.post("/login", login);

// router.post(
//   "/refresh",
//   doubleCsrfProtection,
//   refresh
// );

// router.post(
//   "/logout",
//   doubleCsrfProtection,
//   logout
// );

// export default router;
// ```

// ---

// ## Final Flow

// ### Login

// * verify email/password
// * create access token
// * create refresh token
// * set access + refresh cookies
// * generate CSRF token using `generateToken(req, res)`
// * set csrf cookie
// * return csrf token

// ### Refresh

// * verify refresh token
// * rotate refresh token
// * regenerate CSRF token
// * update cookies

// ### Logout

// * verify CSRF
// * clear all cookies

// ### Protected write routes

// * verify access token using `protect`
// * verify CSRF using `doubleCsrfProtection`

// ---

// # Frontend (React + Axios + Router)

// ## axios.js

// ```js
// import axios from "axios";
// import { getCSRF } from "./csrf";

// const BASE_URL = "http://localhost:5000/api/auth";

// export const publicAxios = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// export const privateAxios = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error = null) => {
//   failedQueue.forEach((p) => {
//     error ? p.reject(error) : p.resolve();
//   });

//   failedQueue = [];
// };

// privateAxios.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (!error.response) {
//       return Promise.reject(error);
//     }

//     if (error.response.status === 401) {
//       if (originalRequest._retry) {
//         window.location.href = "/login";
//         return Promise.reject(error);
//       }

//       if (originalRequest.url.includes("/refresh")) {
//         window.location.href = "/login";
//         return Promise.reject(error);
//       }

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: () => resolve(privateAxios(originalRequest)),
//             reject,
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         await publicAxios.post(
//           "/refresh",
//           {},
//           {
//             headers: {
//               "x-csrf-token": getCSRF(),
//             },
//           }
//         );

//         isRefreshing = false;
//         processQueue();

//         return privateAxios(originalRequest);
//       } catch (err) {
//         isRefreshing = false;
//         processQueue(err);

//         window.location.href = "/login";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
// ```

// ---

// ## csrf.js

// ```js
// export const getCSRF = () =>
//   document.cookie
//     .split("; ")
//     .find((cookie) => cookie.startsWith("csrfToken="))
//     ?.split("=")[1];
// ```

// ---

// ## AuthContext.jsx

// ```js
// import { createContext, useEffect, useState } from "react";
// import { privateAxios } from "../api/axios";

// export const AuthContext = createContext();

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [checked, setChecked] = useState(false);

//   useEffect(() => {
//     privateAxios
//       .get("/me")
//       .then((res) => {
//         setUser(res.data.user);
//       })
//       .catch(() => {
//         setUser(null);
//       })
//       .finally(() => {
//         setChecked(true);
//       });
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         checked,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
// ```

// ---

// ## PrivateRoute.jsx

// ```js
// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// export default function PrivateRoute({
//   children,
//   roles = [],
// }) {
//   const { user, checked } = useContext(AuthContext);

//   if (!checked) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roles.length && !roles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// }
// ```

// ---

// ## App.jsx

// ```js
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import PrivateRoute from "./routes/PrivateRoute";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />

//         <Route
//           path="/user"
//           element={
//             <PrivateRoute>
//               <User />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/admin"
//           element={
//             <PrivateRoute roles={["admin"]}>
//               <Admin />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/manager"
//           element={
//             <PrivateRoute roles={["admin", "manager"]}>
//               <Manager />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/unauthorized"
//           element={<Unauthorized />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }
// ```

// \---src
//     |   App.css
//     |   App.jsx
//     |   index.js
//     |
//     +---assets
//     |   +---Images
//     |   |       aboutus1.webp
//     |   |       aboutus2.webp
//     |   |       aboutus3.webp
//     |   |       banner.mp4
//     |   |       bghome.svg
//     |   |       boxoffice.png
//     |   |       Compare_with_others.png
//     |   |       Compare_with_others.svg
//     |   |       FoundingStory.png
//     |   |       frame.png
//     |   |       Instructor.png
//     |   |       Know_your_progress.png
//     |   |       Know_your_progress.svg
//     |   |       login.webp
//     |   |       Plan_your_lessons.png
//     |   |       Plan_your_lessons.svg
//     |   |       signup.webp
//     |   |       TimelineImage.png
//     |   |
//     |   +---Logo
//     |   |       Logo-Full-Dark.png
//     |   |       Logo-Full-Light.png
//     |   |       Logo-Small-Dark.png
//     |   |       Logo-Small-Light.png
//     |   |       rzp_logo.png
//     |   |
//     |   \---TimeLineLogo
//     |           Logo1.svg
//     |           Logo2.svg
//     |           Logo3.svg
//     |           Logo4.svg
//     |
//     +---components
//     |   +---Common
//     |   |       ConfirmationModal.jsx
//     |   |       Footer.jsx
//     |   |       IconBtn.jsx
//     |   |       Navbar.jsx
//     |   |       RatingStars.jsx
//     |   |       ReviewSlider.jsx
//     |   |       Tab.jsx
//     |   |
//     |   \---core
//     |       +---AboutPage
//     |       |       ContactFormSection.jsx
//     |       |       LearningGrid.jsx
//     |       |       Quote.jsx
//     |       |       Stats.jsx
//     |       |
//     |       +---Auth
//     |       |       LoginForm.jsx
//     |       |       OpenRoute.jsx
//     |       |       PrivateRoute.jsx
//     |       |       ProfileDropdown.jsx
//     |       |       SignupForm.jsx
//     |       |       Template.jsx
//     |       |
//     |       +---Catalog
//     |       |       Course_Card.jsx
//     |       |       Course_Slider.jsx
//     |       |
//     |       +---ContactUsPage
//     |       |       ContactDetails.jsx
//     |       |       ContactForm.jsx
//     |       |       ContactUsForm.jsx
//     |       |
//     |       +---Course
//     |       |       CourseAccordionBar.jsx
//     |       |       CourseDetailsCard.jsx
//     |       |       CourseSubSectionAccordion.jsx
//     |       |
//     |       +---Dashboard
//     |       |   |   EnrolledCourses.jsx
//     |       |   |   Instructor.jsx
//     |       |   |   MyCourses.jsx
//     |       |   |   MyProfile.jsx
//     |       |   |   Sidebar.jsx
//     |       |   |   SidebarLink.jsx
//     |       |   |
//     |       |   +---AddCourse
//     |       |   |   |   index.jsx
//     |       |   |   |   RenderSteps.jsx
//     |       |   |   |   Upload.jsx
//     |       |   |   |
//     |       |   |   +---CourseBuilder
//     |       |   |   |       CourseBuilderForm.jsx
//     |       |   |   |       NestedView.jsx
//     |       |   |   |       SubSectionModal.jsx
//     |       |   |   |
//     |       |   |   +---CourseInformation
//     |       |   |   |       ChipInput.jsx
//     |       |   |   |       CourseInformationForm.jsx
//     |       |   |   |       RequirementsField.jsx
//     |       |   |   |
//     |       |   |   \---PublishCourse
//     |       |   |           index.jsx
//     |       |   |
//     |       |   +---Cart
//     |       |   |       index.jsx
//     |       |   |       RenderCartCourses.jsx
//     |       |   |       RenderTotalAmount.jsx
//     |       |   |
//     |       |   +---EditCourse
//     |       |   |       index.jsx
//     |       |   |
//     |       |   +---InstructorCourses
//     |       |   |       CoursesTable.jsx
//     |       |   |
//     |       |   +---InstructorDashboard
//     |       |   |       InstructorChart.jsx
//     |       |   |
//     |       |   \---Settings
//     |       |           ChangeProfilePicture.jsx
//     |       |           DeleteAccount.jsx
//     |       |           EditProfile.jsx
//     |       |           index.jsx
//     |       |           UpdatePassword.jsx
//     |       |
//     |       +---HomePage
//     |       |       Button.jsx
//     |       |       CodeBlocks.jsx
//     |       |       CourseCard.jsx
//     |       |       ExploreMore.jsx
//     |       |       HighlightText.jsx
//     |       |       InstructorSection.jsx
//     |       |       LearningLanguageSection.jsx
//     |       |       Timeline.jsx
//     |       |
//     |       \---ViewCourse
//     |               CourseReviewModal.jsx
//     |               VideoDetails.jsx
//     |               VideoDetailsSidebar.jsx
//     |
//     +---data
//     |       countrycode.json
//     |       dashboard-links.js
//     |       footer-links.js
//     |       homepage-explore.js
//     |       navbar-links.js
//     |
//     +---hooks
//     |       useOnClickOutside.js
//     |       useRouteMatch.js
//     |
//     +---pages
//     |       About.jsx
//     |       Catalog.jsx
//     |       Contact.jsx
//     |       CourseDetails.jsx
//     |       Dashboard.jsx
//     |       Error.jsx
//     |       ForgotPassword.jsx
//     |       Home.jsx
//     |       Login.jsx
//     |       Signup.jsx
//     |       UpdatePassword.jsx
//     |       VerifyEmail.jsx
//     |       ViewCourse.jsx
//     |
//     +---reducer
//     |       index.js
//     |
//     +---services
//     |   |   apiConnector.js
//     |   |   apis.js
//     |   |   formatDate.js
//     |   |
//     |   \---operations
//     |           authAPI.js
//     |           courseDetailsAPI.js
//     |           pageAndComponntDatas.js
//     |           profileAPI.js
//     |           SettingsAPI.js
//     |           studentFeaturesAPI.js
//     |
//     +---slices
//     |       authSlice.js
//     |       cartSlice.js
//     |       courseSlice.js
//     |       profileSlice.js
//     |       viewCourseSlice.js
//     |
//     \---utils
//             avgRating.js
//             constants.js
//             dateFormatter.js
