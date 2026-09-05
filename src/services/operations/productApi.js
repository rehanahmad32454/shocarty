import toast from "react-hot-toast";
import { ProductEndPoints } from "../apis";
import { privateConnector } from "../apiConnectors";
import {
  // resetProductState,
  setEditMode,
  setProduct,
  setProductLoading,
  setProducts,
  setTotalPages,
} from "../../slices/productSlice";

const {
  ADDPRODUCT_API,
  GETPRODUCT_API,
  UPDATEPRODUCT_API,
  DELETEPRODUCT_API,
  GETALLPRODUCTS_API,
} = ProductEndPoints;

export const addProduct = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(setProductLoading(true));
      const res = await privateConnector("POST", ADDPRODUCT_API, formData);
      dispatch(setProductLoading(false));
      toast.success("Product added successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

export const updateProduct = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(setProductLoading(true));
      const res = await privateConnector("PATCH", UPDATEPRODUCT_API, formData);
      dispatch(setProductLoading(false));
      console.log(res?.data?.data);
      dispatch(setProduct(res?.data?.data?.product));
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

// export const getProduct = async (productId) => {
//   try {
//     const res = await privateConnector("POST", GETPRODUCT_API, { productId });
//     console.log(res);
//     return res?.data?.data?.product;
//     toast.success("Product Data fetched successfully");
//   } catch (error) {
//     toast.error(error?.response?.data?.message);
//   }
// };

export const getProduct = (productId) => {
  return async (dispatch) => {
    try {
      dispatch(setProductLoading(true));
      const res = await privateConnector("POST", GETPRODUCT_API, { productId });
      dispatch(setProduct(res?.data?.data?.product));
      dispatch(setEditMode(true));
      toast.success("Product Data fetched successfully");
    } catch (error) {
      dispatch(setProduct(null));
      dispatch(setEditMode(false));
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

export const getAllProducts = (page, limit = 4) => {
  return async (dispatch) => {
    try {
      dispatch(setProductLoading(true));
      const res = await privateConnector(
        "POST",
        GETALLPRODUCTS_API,
        null,
        {},
        {
          page,
          limit,
        },
      );
      dispatch(setProducts(res.data.data.products));
      dispatch(setTotalPages(res.data.data.totalPages));
      dispatch(setProductLoading(false));
    } catch (error) {
      toast.error(error?.response?.data?.message);
      resetProductState();
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

export const deleteProduct = async (productId) => {
  try {
    const res = await privateConnector("DELETE", DELETEPRODUCT_API, {
      productId,
    });
    console.log(res);
    toast.success(res?.data?.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
