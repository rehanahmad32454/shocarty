import toast from "react-hot-toast";
import { setLoading, setSignupData, setUser } from "../../slices/authSlice";
import { privateConnector, publicConnector } from "../apiConnectors";
import { AuthEndpoints } from "../apis";
import { initializeCsrf } from "../axios";
import { setCsrfToken } from "../security";

const {
  SENDOTP_API,
  LOGIN_API,
  SIGNUP_API,
  LOGOUT_API,
  VERIFYRESETTOKEN_API,
  RESETPASSWORDTOKEN_API,
  CHANGEPASSWORD_API,
  BLOCKUSER_API,
  UNBLOCKUSER_API,
} = AuthEndpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const res = await publicConnector("POST", SENDOTP_API, { email });
      toast.success(res?.data?.message);
      navigate("/verify-email");
      console.log(res);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const res = await publicConnector("POST", LOGIN_API, { email, password });
      toast.success(res?.data?.message);
      // console.log(res?.data?.data?.user);
      dispatch(setUser(res?.data?.data?.user));
      localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
      initializeCsrf();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  firstName,
  lastName,
  email,
  password,
  role,
  otp,
  navigate,
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const res = await publicConnector("POST", SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
        role,
        otp,
      });
      toast.success(res?.data?.message);
      dispatch(setSignupData(null));
      sessionStorage.removeItem("signupData");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function resetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const res = await publicConnector("POST", RESETPASSWORDTOKEN_API, {
        email,
      });
      console.log(res);
      toast.success(res?.data?.message);
      setEmailSent(true);
      // navigate("/")
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function verifyResetToken(resetPasswordToken, password) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const res = await publicConnector("POST", VERIFYRESETTOKEN_API, {
        resetPasswordToken,
        password,
      });
      console.log(res);
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const res = await privateConnector("POST", LOGOUT_API);
      dispatch(setUser(null));
      setCsrfToken(null);
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// export async function blockUser(userId) {
//   try {
//     await privateConnector("POST", BLOCKUSER_API, { userId });
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//   }
// }

// export async function blockUser(userId) {
//   try {
//     await privateConnector("POST", BLOCKUSER_API, { userId });
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//   }
// }

// export async function unBlockUser(userId) {
//   try {
//     await privateConnector("POST", UNBLOCKUSER_API, { userId });
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//   }
// }
// export const deleteProduct = async (productId) => {

export const blockUser = async (userId) => {
  try {
    await privateConnector("POST", BLOCKUSER_API, { userId });
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const unBlockUser = async (userId) => {
  try {
    await privateConnector("POST", UNBLOCKUSER_API, { userId });
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
