import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdCurrencyRupee } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ConfirmationModal } from "../../../common/ConfirmationModal";
import {
  deleteProduct,
  getAllProducts,
} from "../../../../services/operations/productApi";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

export const ProductCard = ({
  _id: productId,
  productName,
  productDescription,
  productThumbnail,
  productPrice,
  setRefresh,
}) => {
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const { products, productLoading, totalPages } = useSelector(
    (state) => state.product,
  );
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [readMore, setReadMore] = useState(false);

  async function delProduct(productId) {
    try {
      setLoading(true);
      await deleteProduct(productId);
      setRefresh((prev) => prev + 1);
    } catch (error) {
    } finally {
      setLoading(false);
      setConfirmationModal(null);
    }
  }
  let description = readMore
    ? productDescription.split(" ").join(" ")
    : productDescription.split(" ").slice(0, 30).join(" ");
  return (
    <div className="w-full flex lg:min-h-52 lg:flex-row justify-between gap-x-2 flex-col bg-violet-400 p-4 rounded-lg outline-2 gap-y-2">
      <div className="lg:w-60 w-full h-52 bg-white flex justify-center items-center rounded-lg">
        <img
          className="max-h-full max-w-full object-cover overflow-hidden"
          src={productThumbnail}
          alt={productName}
        ></img>
      </div>
      <div className="flex flex-col gap-y-2 lg:max-w-96 w-full overflow-x-hidden">
        <div className="text-xl font-bold">{productName}</div>
        <div>
          {readMore
            ? description
            : productDescription.split(" ").slice(0, 30).join(" ")}
          {productDescription.split(" ").length > 30 && (
            <span onClick={() => setReadMore(!readMore)}>
              {`${readMore ? `show less` : `...read more`}`}
            </span>
          )}
        </div>
      </div>
      <div className="font-bold">&#8377;{`${productPrice}`}</div>
      <div className="flex gap-x-2 justify-between">
        <Link to={`/dashboard/editproduct/${productId}`}>
          <MdEdit
            className="text-white hover:text-green-400 hover:cursor-pointer hover:scale-125 ease-in duration-100"
            size={24}
          />
        </Link>
        <MdDelete
          className="text-white hover:text-red-500 hover:cursor-pointer hover:scale-125 ease-in duration-100"
          size={24}
          onClick={() => {
            setConfirmationModal({
              text1: "Do you want to delete this product ?",
              text2: "All the data related to this product will be deleted",
              btn1Text: "Delete",
              loadingText: "Processing...",
              btn2Text: "Cancel",
              btn1Handler: () => delProduct(productId),
              btn2Handler: () => setConfirmationModal(null),
            });
          }}
        />
      </div>
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} Loading={Loading} />
      )}
    </div>
  );
};
