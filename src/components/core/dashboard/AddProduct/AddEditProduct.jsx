import React, { useEffect, useRef, useState } from "react";
import { useForm, Watch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../../../services/operations/categoryApi";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import {
  addProduct,
  getProduct,
  updateProduct,
} from "../../../../services/operations/productApi";
import { useParams } from "react-router-dom";
import { Spinner } from "../../../common/Spinner";

const AddEditProduct = () => {
  const { product, editMode } = useSelector((state) => state.product);
  const { productId } = useParams();
  const [category, setCategory] = useState(null);
  const [removedImages, setRemoveImages] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const thumbnailInputRef = useRef("");
  const productImageInputRef = useRef("");

  const dispatch = useDispatch();

  const { productLoading } = useSelector((state) => state.product);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      productDescription: "",
      categoryId: "",
      productPrice: null,
      productThumbnail: null,
      productImage: [],
    },
  });

  useEffect(() => {
    register("productThumbnail", {
      validate: (value) => {
        if (!value) return "Please add Thumbnail";
        if (typeof value === "string") return true;
        if (value instanceof File) return true;
        return "Please add Thumbnail";
      },
    });
    register("productImage", {
      validate: (value) => {
        if (!Array.isArray(value)) return "Please add at least one image";
        if (value.length == 0) return "Please add at least one image";
        if (value.length > 5) return "Maximum 4 image can be added";
        return true;
      },
    });
  }, [register]);

  const thumbnail = watch("productThumbnail");
  const images = watch("productImage");

  useEffect(() => {
    let nextPreview = [];
    if (thumbnailPreview) {
      if (thumbnailPreview.file) {
        URL.revokeObjectURL(thumbnailPreview.url);
      }
    }
    if (!thumbnail) {
      setThumbnailPreview(null);
    }
    if (typeof thumbnail === "string") {
      setThumbnailPreview({
        id: thumbnail,
        url: thumbnail,
      });
    } else if (thumbnail instanceof File) {
      setThumbnailPreview({
        id: thumbnail.name + Math.random().toString(36).slice(2),
        url: URL.createObjectURL(thumbnail),
        file: thumbnail,
      });
    }
    imagePreview.forEach((p) => {
      if (p.file) URL.revokeObjectURL(p.url);
    });
    images.forEach((item, i) => {
      if (typeof item === "string") {
        nextPreview.push({
          id: item,
          url: item,
        });
      } else {
        nextPreview.push({
          id: item.name + "1",
          url: URL.createObjectURL(item),
          file: item,
        });
      }
    });
    setImagePreview(nextPreview);
  }, [images, thumbnail]);

  const removeImage = (pre, i) => {
    const updated = [...images];
    updated.splice(i, 1);
    setValue("productImage", updated);
    if (pre?.file) {
      console.log("file", pre);
      if (pre?.url) {
        URL.revokeObjectURL(pre?.url);
      }
    } else {
      if (pre?.url) setRemoveImages((prev) => [...prev, pre?.url]);
    }
    setSubmitError((prev) => ({
      ...prev,
      productImage: "",
    }));
  };

  const removeThumbnail = (f) => {
    if (typeof f === "string") {
    } else {
      if (f.file) {
        URL.revokeObjectURL(f.url);
      }
    }
    setValue("productThumbnail", null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setSubmitError((prev) => ({
      ...prev,
      productThumbnail: "",
    }));
  };

  const addThumbnailImage = (file) => {
    const supportedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (supportedTypes.includes(file.type)) {
      setValue("productThumbnail", file, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      toast.error("Unsupported file type");
    }
    setSubmitError((prev) => ({
      ...prev,
      productThumbnail: "",
    }));
  };

  const addImages = (files) => {
    const supportedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const validFiles = [];
    files.forEach((file) => {
      if (supportedTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        toast.error("Unsupported file type");
      }
      if (validFiles.length) {
        setValue("productImage", [...images, ...validFiles], {
          shouldValidate: true,
        });
      }
    });
    setSubmitError((prev) => ({
      ...prev,
      productImage: "",
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const data = await getCategories();
      setCategory(data.data.data.category);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editMode && product) {
      setValue("productName", product.productName);
      setValue("productDescription", product.productDescription);
      setValue("categoryId", product.categoryId);
      setValue("productPrice", product.productPrice);
      setValue("productThumbnail", product.productThumbnail);
      setValue("productImage", product.images);
    } else {
      reset();
    }
  }, [editMode, setValue]);

  async function onSubmit(data) {
    const formData = new FormData();
    setSubmitError(null);
    if (!data.productThumbnail) {
      setSubmitError((prev) => ({
        ...prev,
        productThumbnail: "Please add Thumbnail",
      }));
      return;
    }
    if (!data.productImage?.length) {
      setSubmitError((prev) => ({
        ...prev,
        productImage: "Please add at least one image",
      }));
      return;
    }
    if (data.productImage?.length > 4) {
      setSubmitError((prev) => ({
        ...prev,
        productImage: "Maximum 4 images can be added",
      }));
      return;
    }
    formData.append("productName", data.productName);
    formData.append("productDescription", data.productDescription);
    formData.append("categoryId", data.categoryId);
    formData.append("productPrice", data.productPrice);
    if (data.productThumbnail instanceof File)
      formData.append("productThumbnail", data.productThumbnail);
    data.productImage.map((img) => {
      if (img instanceof File) formData.append("productImage", img);
    });
    if (editMode) {
      formData.append("productId", productId);
      removedImages.map((img) => {
        formData.append("removedImages", img);
      });
    }

    console.log("formdata", formData);
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      if (editMode) {
        dispatch(updateProduct(formData));
      } else {
        dispatch(addProduct(formData));
      }
    } catch (error) {
      console.log(error);
    }

    if (thumbnailPreview) {
      if (thumbnailPreview.file) {
        URL.revokeObjectURL(thumbnailPreview.url);
      }
    }

    imagePreview.forEach((p) => {
      if (p.file) URL.revokeObjectURL(p.url);
    });
  }

  if (loading && editMode) return <Spinner />;

  return (
    <div className="flex w-full gap-x-10 p-4 rounded-lg justify-center">
      <div className="rounded-lg lg:flex-row flex-col-reverse flex bg-white p-4 gap-x-10 items-center lg:items-start gap-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg flex flex-col gap-y-3 w-full lg:w-md outline-2 outline-gray-200 p-4"
        >
          <div className="flex flex-col gap-y-2">
            <label>Product Name</label>
            <input
              className="p-2 outline-1 rounded-md w-full"
              id="productName"
              placeholder="Enter Product Name"
              {...register("productName", { required: true })}
            ></input>
            {errors.productName && <span>Product name is required</span>}
          </div>
          <div className="flex flex-col gap-y-2">
            <label>Product Description</label>
            <textarea
              className="w-full min-h-32 outline-1 p-2 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              id="productDescription"
              placeholder="Enter Product Description"
              {...register("productDescription", { required: true })}
            ></textarea>
            {errors.productDescription && (
              <span>Product description is required</span>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label>Product Category</label>
            <select
              {...register("categoryId", { required: true })}
              className="p-2 outline-1 rounded-md w-full"
            >
              <option className="rounded-md" value="" disabled>
                Choose a Category
              </option>
              {!loading &&
                category?.map((category, index) => (
                  <option
                    className="rounded-md"
                    key={index}
                    value={category?._id}
                  >
                    {category.categoryName}
                  </option>
                ))}
            </select>
            {errors.categoryId && <span>Product category is required</span>}
          </div>
          <div className="flex flex-col gap-y-2">
            <label>Product Price</label>
            <input
              className="w-full p-2 rounded-md outline-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              id="productPrice"
              type="number"
              placeholder="Enter Product Price"
              onWheel={(e) => e.target.blur()}
              {...register("productPrice", {
                required: "Price is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Price cannot be negative",
                },
                validate: (value) =>
                  !isNaN(value) || "Please enter a valid price",
              })}
            ></input>
            {errors.productPrice && (
              <span className="text-sm text-red-500">
                {errors.productPrice.message}
              </span>
            )}
          </div>
          {!thumbnailPreview ? (
            <div className="flex flex-col gap-y-2 justify-between">
              <label>Product Thumbnail</label>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  addThumbnailImage(e.dataTransfer.files?.[0]);
                }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => thumbnailInputRef.current.click()}
                className="w-full h-64 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-400"
              >
                <p className="text-gray-500">
                  Drag & drop files here or click to upload
                </p>
                <p className="text-gray-400">Supported: JPG, PNG,</p>
              </div>
              <input
                ref={thumbnailInputRef}
                type="file"
                id="productThumbnail"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={(e) => {
                  addThumbnailImage(e.target.files?.[0]);
                  e.target.value = "";
                }}
              ></input>
              {errors.productThumbnail && (
                <span>Product thumbnail is required</span>
              )}
              {submitError?.productThumbnail && (
                <span>{submitError?.productThumbnail}</span>
              )}
            </div>
          ) : (
            <label>Product Thumbnail</label>
          )}
          {thumbnailPreview && (
            <div className="w-full h-64 flex flex-col items-center gap-y-2 outline-1">
              <div className="w-full h-full overflow-hidden">
                <img
                  className="h-full w-full object-contain"
                  src={thumbnailPreview.url}
                ></img>
              </div>
              <div
                className="cursor-pointer text-blue-400 hover:underline"
                onClick={() => removeThumbnail(thumbnailPreview)}
              >
                Cancel
              </div>
            </div>
          )}
          <div className="flex flex-col gap-y-2">
            <label>Product Image</label>
            <div
              onDrop={(e) => {
                e.preventDefault();
                addImages(Array.from(e.dataTransfer.files));
                e.target.value = "";
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => productImageInputRef.current.click()}
              className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-400"
            >
              <p className="text-gray-500">
                Drag & drop files here or click to upload
              </p>
              <p className="text-gray-400">Supported: JPG, PNG,</p>
              <input
                ref={productImageInputRef}
                type="file"
                id="productImage"
                multiple
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => {
                  addImages(Array.from(e.target.files));
                  e.target.value = "";
                }}
                className="hidden"
              ></input>
            </div>
            {errors.productImage && <span>{errors.productImage.message}</span>}
            {submitError?.productImage && (
              <span>{submitError?.productImage}</span>
            )}
          </div>
          <div className="w-full overflow-hidden">
            <div className="flex gap-2 items-start flex-wrap">
              {imagePreview.map((imgprev, i) => (
                <div key={i} className="rounded-md overflow-hidden relative">
                  <div className="hover:cursor-pointer w-24 h-24 hover:bg-black/30 absolute"></div>
                  <img
                    className="w-24 h-24 object-cover"
                    src={imgprev.url}
                    alt=""
                  />
                  <MdDelete
                    onClick={() => removeImage(imgprev, i)}
                    size={20}
                    className="hover:cursor-pointer text-black absolute top-1 right-1 hover:text-red-500 hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* <button className="mt-5 text-base w-full bg-blue-500 hover:bg-blue-400 hover:cursor-pointer rounded-md px-1 py-2">
            {editMode ? "Update Product" : "Add Product"}
          </button> */}
          <button
            disabled={productLoading}
            className={`text-base w-full rounded-md px-1 py-2 ${productLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-400 hover:cursor-pointer"}`}
          >
            {editMode ? "Update Product" : "Add Product"}
          </button>
        </form>
        <div className="flex flex-col gap-y-2 outline-2 outline-gray-200 p-4 rounded-lg w-full lg:w-fit h-fit lg:sticky lg:top-4">
          <h1 className="text-xl font-semibold">Product Upload Tips</h1>
          <ul className="flex flex-col list-disc pl-5 space-y-2">
            <li>Set the product name.</li>
            <li>Set the product description.</li>
            <li>Set the product price or 0 for make it free.</li>
            <li>Upload a clear and high-quality product thumbnail.</li>
            <li>Add at least one product image for better visibility.</li>
            <li>You can upload up to 4 product images.</li>
            <li>Supported image formats: JPG, PNG, and WEBP.</li>
            <li>Each image must be smaller than 5MB.</li>
            <li>Complete all required product details before submitting.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddEditProduct;
