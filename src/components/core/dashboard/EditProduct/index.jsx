import React, { useEffect, useState } from "react";
import AddEditProduct from "../AddProduct/AddEditProduct";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct } from "../../../../services/operations/productApi";
import { Spinner } from "../../../common/Spinner";

export const EditProduct = () => {
  const { productId } = useParams();
  const { product, editMode, productLoading } = useSelector(
    (state) => state.product,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(getProduct(productId));
    } catch (error) {}
  }, [dispatch, productId]);

  if (productLoading && !product) {
    return null;
  }

  if (!product) {
    return (
      <h1 className="font-bold text-2xl text-center">Product not Found</h1>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold">EDIT PRODUCT</h1>

        <div className="min-h-screen w-full flex justify-center">
          <AddEditProduct />
        </div>
      </div>
    </div>
  );
};
