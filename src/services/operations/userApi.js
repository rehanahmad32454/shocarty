import toast from "react-hot-toast";
import { setLoading, setUser } from "../../slices/authSlice";
import { UserEndPoints } from "../apis";
import { privateConnector } from "../apiConnectors";
import {
  setTotalPages,
  setUserLoading,
  setUsers,
} from "../../slices/userSlice";

const { GETUSERDETAILS_API, GETALLUSERS_API } = UserEndPoints;

export function getUser() {
  return async (dispatch) => {
    // const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const res = await privateConnector("GET", GETUSERDETAILS_API);
      dispatch(setUser(res?.data?.data?.user));
      localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
      // toast.success(res?.data?.message);
    } catch (error) {
      // dispatch(setUser(null));
      // sessionStorage.removeItem("user");
      // toast.error(error?.response?.data?.message);
      dispatch(setUser(null));
      localStorage.removeItem("user");
      const status = error?.response?.status;
      if (status !== 401) {
        console.error("Unexpected getUser error:", error);
      }
    }
    dispatch(setLoading(false));
    // toast.dismiss(toastId);
  };
}

// export async function getAllUsers(page = 1, limit = 3) {
//   try {
//     const res = await privateConnector(
//       "POST",
//       GETALLUSERS_API,
//       null,
//       {},
//       {
//         page,
//         limit,
//       },
//     );
//     return res;
//   } catch (error) {}
// }

export function getAllUsers(page = 1, limit = 3) {
  return async (dispatch) => {
    try {
      dispatch(setUserLoading(true));
      const res = await privateConnector(
        "POST",
        GETALLUSERS_API,
        null,
        {},
        {
          page,
          limit,
        },
      );
      console.log("response", res.data.data);
      dispatch(setUsers(res.data.data.users));
      dispatch(setTotalPages(res.data.data.totalPages));
    } catch (error) {
    } finally {
      dispatch(setUserLoading(false));
    }
  };
}
