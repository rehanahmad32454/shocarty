import { ACCOUNT_TYPE } from "../utils/constants";
export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/myprofile",
    icon: "CgProfile",
  },
  {
    id: 2,
    name: "Add Product",
    path: "/dashboard/addproduct",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "AiOutlinePlusCircle",
  },
  {
    id: 3,
    name: "View Products",
    type: ACCOUNT_TYPE.ADMIN,
    path: "/dashboard/products",
    icon: "MdOutlineInventory2",
  },
  {
    id: 4,
    name: "Cart",
    type: ACCOUNT_TYPE.CUSTOMER,
    path: "/dashboard/cart",
    icon: "IoCartOutline",
  },
  {
    id: 5,
    name: "Order",
    type: ACCOUNT_TYPE.CUSTOMER,
    path: "/dashboard/order",
    icon: "LuShoppingBag",
  },
  {
    id: 6,
    name: "All Users",
    path: "/dashboard/users",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "FaUsers",
  },
  {
    id: 7,
    name: "All Orders",
    type: ACCOUNT_TYPE.ADMIN,
    path: "/dashboard/allorders",
    icon: "LuShoppingBag",
  },
  {
    id: 8,
    name: "Setting",
    path: "/dashboard/setting",
    icon: "IoSettingsOutline",
  },
  {
    id: 9,
    name: "Logout",
    path: "/dashboard/logout",
    icon: "FiLogOut",
  },
];
