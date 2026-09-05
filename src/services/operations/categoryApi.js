import toast from "react-hot-toast";
import { CategoryEndPoints } from "../apis";
import { privateConnector } from "../apiConnectors";
import { setLoading } from "../../slices/authSlice";

const { GETCATEGORY_API } = CategoryEndPoints;

export const getCategories = async () => {
  try {
    const res = await privateConnector("GET", GETCATEGORY_API);
    console.log(res);
    return res;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
