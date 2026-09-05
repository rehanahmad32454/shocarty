const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthEndpoints = {
  SENDOTP_API: `${BASE_URL}/auth/sendotp`,
  SIGNUP_API: `${BASE_URL}/auth/signup`,
  LOGIN_API: `${BASE_URL}/auth/login`,
  RESETPASSWORDTOKEN_API: `${BASE_URL}/auth/resetpasswordtoken`,
  VERIFYRESETTOKEN_API: `${BASE_URL}/auth/verifyresettoken`,
  REFRESHTOKEN_API: `${BASE_URL}/auth/refreshtoken`,
  LOGOUT_API: `${BASE_URL}/auth/logout`,
  CHANGEPASSWORD_API: `${BASE_URL}/auth/changepassword`,
  BLOCKUSER_API: `${BASE_URL}/auth/block`,
  UNBLOCKUSER_API: `${BASE_URL}/auth/unblock`,
};

export const CategoryEndPoints = {
  ADDCATEGORY_API: `${BASE_URL}/category/addcategory`,
  GETCATEGORY_API: `${BASE_URL}/category/getcategory`,
  EDITCATEGORY_API: `${BASE_URL}/category/editcategory`,
  DELETECATEGORY_API: `${BASE_URL}/category/deletecategory`,
  PAGINATECATEGORY: `${BASE_URL}/category/paginatecategory`,
  CATEGORYSHOWCASE: `${BASE_URL}/category/categoryshowcase`,
};

export const ProductEndPoints = {
  ADDPRODUCT_API: `${BASE_URL}/product/addproduct`,
  UPDATEPRODUCT_API: `${BASE_URL}/product/updateproduct`,
  DELETEPRODUCT_API: `${BASE_URL}/product/deleteproduct`,
  GETPRODUCT_API: `${BASE_URL}/product/getproduct`,
  GETALLPRODUCTS_API: `${BASE_URL}/product/getallproducts`,
  SEARCHFILTER: `${BASE_URL}/product/searchfilter`,
};
export const CartEndPoints = {
  ADDTOCART_API: `${BASE_URL}/cart/addtocart`,
  GETCARTITEMS_API: `${BASE_URL}/cart/getcartitems`,
  UPDATECART_API: `${BASE_URL}/cart/addtocart`,
  EMPTYCART_API: `${BASE_URL}/cart/emptycart`,
};

export const OrderEndPoints = {
  CANCELORDER_API: `${BASE_URL}/order/cancelorder`,
  DELIVERORDER_API: `${BASE_URL}/order/deliverorder`,
  GETORDER_API_API: `${BASE_URL}/order/getorder`,
  MARKPAYMENTFAILED_API: `${BASE_URL}/order/markpaymentfailed`,
  PLACEORDER_API_API: `${BASE_URL}/order/placeorder`,
  VERIFYPAYMENT_API: `${BASE_URL}/order/verifypayment`,
};

export const UserEndPoints = {
  GETUSERDETAILS_API: `${BASE_URL}/user/getuserdetails`,
  UPDATEPROFILE_API: `${BASE_URL}/user/updateprofile`,
  CONTACTUS_API: `${BASE_URL}/user/contactus`,
  GETALLUSERS_API: `${BASE_URL}/user/getallusers`,
};
