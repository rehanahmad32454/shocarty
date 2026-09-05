import { useEffect } from "react";
import AddEditProduct from "./AddEditProduct";
import { useDispatch } from "react-redux";
import { resetProductForm } from "../../../../slices/productSlice";
export const AddProduct = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetProductForm());
  }, [dispatch]);

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold">ADD PRODUCT</h1>
      <div className="min-h-screen w-full flex justify-center">
        <AddEditProduct />
      </div>
    </div>
  );
};
