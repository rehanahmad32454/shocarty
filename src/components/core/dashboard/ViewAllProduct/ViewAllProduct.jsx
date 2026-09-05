import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../../../services/operations/productApi";
import { useDispatch, useSelector } from "react-redux";
import { ProductCard } from "./ProductCard";
import { Spinner } from "../../../common/Spinner";
import { Pagination } from "../../../common/Pagination";
import { useSearchParams } from "react-router-dom";

const ViewAllProduct = () => {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("page");
  const parsed = Number(raw);
  const page = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  const { productLoading, totalPages, products } = useSelector(
    (state) => state.product,
  );

  useEffect(() => {
    dispatch(getAllProducts(page));
  }, [page, refresh, dispatch]);

  useEffect(() => {
    const isInvalid = !Number.isInteger(parsed) || parsed <= 0;
    if (isInvalid) {
      setSearchParams({ page: String(1) });
    }
    if (totalPages && page > totalPages) {
      setSearchParams({ page: String(totalPages) });
    }
  }, [page, totalPages]);

  const prevPage = () => {
    setSearchParams({ page: String(page - 1) });
  };

  const nextPage = () => {
    setSearchParams({ page: String(page + 1) });
  };

  if (productLoading) return <Spinner />;

  return (
    !productLoading && (
      <div className="w-full flex flex-col gap-y-4 mx-auto">
        {products && products?.length > 0 ? (
          <>
            {products?.map((p) => (
              <ProductCard key={p._id} {...p} setRefresh={setRefresh} />
            ))}
            {totalPages > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                prevPage={prevPage}
                nextPage={nextPage}
              />
            )}
          </>
        ) : (
          <h1 className="font-bold text-2xl text-center">No Products Found</h1>
        )}
      </div>
    )
  );
};

export default ViewAllProduct;
