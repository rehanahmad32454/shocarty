import mongoose from "mongoose";
import Product from "../models/Product.js";
import ProductImage from "../models/ProductImage.js";
import {
  fileSize,
  isEmpty,
  isValidMongoId,
} from "../utils/validation/validate.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import { cloudinaryImageUploader } from "../utils/helpers/imageUploader.js";
import { extractPublicIdFromUrl } from "../utils/helpers/extractPublicIdFromUrl.js";
import { cloudinaryImageRemover } from "../utils/helpers/imageRemover.js";
import { ENV } from "../configs/Env.js";
import { FILE_CONFIG } from "../constants/fileConfig.js";
import { APP_CONFIG } from "../constants/appConfig.js";
import { errorResponse, successResponse } from "../utils/helpers/response.js";

const { SHOCARTY_PRODUCT } = ENV;
const { mimeTypes, maxSize } = FILE_CONFIG.IMAGE;
const { DEFAULT_PAGE, DEFAULT_LIMIT } = APP_CONFIG;

export const addProduct = async (req, res) => {
  console.log("Product : addProduct() : Exceution Start");
  let session;
  let uploadPublicIds = [];
  const { productThumbnail, productImage } = req.files || {};
  const ProductImg = productImage
    ? Array.isArray(productImage)
      ? productImage
      : [productImage]
    : [];
  const ProductThumbnail = Array.isArray(productThumbnail)
    ? productThumbnail[0]
    : productThumbnail;
  try {

    console.log("--------------------")
    console.log(ProductThumbnail)
    console.log(ProductImg)
    console.log("--------------------")
    const userId = req.user._id;
    let { categoryId, productName, productDescription, productPrice } =
      req.body;
    if (!isValidMongoId(categoryId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, {
        message: "User not registered",
        statusCode: 401,
      });
    }
    const categoryExist = await Category.findOne({
      _id: categoryId,
      deleted: false,
    });
    if (!categoryExist) {
      return errorResponse(res, {
        message: "Category not exist",
        statusCode: 404,
      });
    }
    if (!ProductThumbnail || typeof ProductThumbnail !== "object") {
      return errorResponse(res, {
        message: "Thumbnail is required and must be a valid file",
        statusCode: 400,
      });
    }
    if (!ProductThumbnail.mimetype.startsWith("image")) {
      return errorResponse(res, {
        message: "Thumbnail must be an image",
        statusCode: 400,
      });
    }
    if (!mimeTypes.includes(ProductThumbnail.mimetype)) {
      return errorResponse(res, {
        message: `Only ${mimeTypes.map((i) =>
          i
            .split("/")
            .filter((i) => i !== "image")
            .join(" "),
        )} files are allowed`,
        statusCode: 400,
      });
    }
    if (fileSize(ProductThumbnail.size, maxSize)) {
      return errorResponse(res, {
        message: "Thumbnail size must be less than 5MB",
        statusCode: 400,
      });
    }
    for (const img of ProductImg) {
      if (!img.mimetype.startsWith("image") || typeof img !== "object") {
        return errorResponse(res, {
          message: "Only images are allowed",
          statusCode: 400,
        });
      }
      if (!mimeTypes.includes(img.mimetype)) {
        return errorResponse(res, {
          message: `Only ${mimeTypes.map((i) =>
            i
              .split("/")
              .filter((i) => i !== "image")
              .join(" "),
          )} files are allowed`,
          statusCode: 400,
        });
      }
      if (fileSize(img.size, maxSize)) {
        return errorResponse(res, {
          message: "Each image size must be less than 5MB",
          statusCode: 400,
        });
      }
    }
    if (ProductImg.length < 1) {
      return errorResponse(res, {
        message: "At least 1 product image is required",
        statusCode: 400,
      });
    }
    if (ProductImg.length > 4) {
      return errorResponse(res, {
        message: "Maximum 4 product images are required",
        statusCode: 400,
      });
    }
    if (
      isEmpty(categoryId) ||
      isEmpty(productName) ||
      isEmpty(productDescription) ||
      isEmpty(productPrice)
    ) {
      return errorResponse(res, {
        message: "All fileds are required",
        statusCode: 422,
      });
    }
    const Thumbnail = await cloudinaryImageUploader(
      ProductThumbnail,
      SHOCARTY_PRODUCT,
    );
    let ThumbnailUrl = null;
    let imagesurl = [];
    if (!isEmpty(Thumbnail)) {
      ThumbnailUrl = Thumbnail.secure_url;
      uploadPublicIds.push(Thumbnail.public_id);
    }
    const ProductImagePromise = ProductImg.map((img) =>
      cloudinaryImageUploader(img, SHOCARTY_PRODUCT),
    );
    const images = await Promise.all(ProductImagePromise);
    if (images.length > 0) {
      imagesurl = images.map((res) => {
        uploadPublicIds.push(res.public_id);
        return res.secure_url;
      });
    }
    session = await mongoose.startSession();
    session.startTransaction();
    const [product] = await Product.create(
      [
        {
          userId,
          categoryId,
          productName,
          productDescription,
          productThumbnail: ThumbnailUrl,
          productPrice,
        },
      ],
      { session },
    );
    let datalist = [];
    for (let img of imagesurl) {
      datalist.push({ Image: img, productId: product._id });
    }
    const savedProductImage = await ProductImage.insertMany(datalist, {
      session,
    });
    await session.commitTransaction();
    const productWithImages = {
      ...product.toObject(),
      images: savedProductImage.map((img) => img.Image),
    };
    console.log("Product : addProduct() : Exceution End");
    return successResponse(res, {
      data: { product: productWithImages },
      message: "Product added successfully",
    });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    await Promise.all(
      uploadPublicIds.map((pid) => cloudinaryImageRemover(pid)),
    );
    console.log(`Error: ${error.message} failed to add product`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export const getProduct = async (req, res) => {
  try {
    console.log("Product : getProduct() : Exceution Start");
    const { productId } = req.body;
    console.log("productId:", productId);
    console.log(typeof productId);
    if (!isValidMongoId(productId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    const product = await Product.findById(productId).lean();
    if (!product) {
      return errorResponse(res, {
        message: "Product not found",
        statusCode: 404,
      });
    }
    const productImage = await ProductImage.find({ productId: product._id });
    let images = productImage.map((img) => img.Image);
    product.images = images;
    console.log("Product : getProduct() : Exceution End");
    return successResponse(res, {
      data: { product },
      message: "Product data fetched suceessfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to get product`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const updateProduct = async (req, res) => {
  console.log("Product : updateProduct() : Exceution Start");
  let userId = req.user._id;
  let oldThumbnail = null;
  let uploadPublicIds = [];
  let session;
  let {
    productId,
    productName,
    productDescription,
    categoryId,
    productPrice,
    removedImages,
  } = req.body;
  const { productThumbnail, productImage } = req.files || {};
  const ProductThumbnail = Array.isArray(productThumbnail)
    ? productThumbnail[0]
    : productThumbnail;
  const ProductImg = productImage
    ? Array.isArray(productImage)
      ? productImage
      : [productImage]
    : [];
  if (!removedImages) {
    removedImages = [];
  } else if (!Array.isArray(removedImages)) {
    removedImages = [removedImages];
  }
  console.log(
    productId,
    productName,
    productDescription,
    categoryId,
    productPrice,
    productThumbnail,
    productImage,
    removedImages,
  );

  try {
    if (!isValidMongoId(productId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    const product = await Product.findOne({ _id: productId, userId: userId });
    if (!product) {
      return errorResponse(res, {
        message: "Product not found",
        statusCode: 404,
      });
    }
    if (!isEmpty(productName)) {
      product.productName = productName;
    }
    if (!isEmpty(productDescription)) {
      product.productDescription = productDescription;
    }
    if (!isEmpty(categoryId)) {
      product.categoryId = categoryId;
    }
    if (!isEmpty(productPrice)) {
      product.productPrice = productPrice;
    }
    if (ProductThumbnail) {
      if (
        !ProductThumbnail.mimetype.startsWith("image") ||
        typeof ProductThumbnail !== "object"
      ) {
        return errorResponse(res, {
          message: "Thumbnail must be an image and must be a valid file",
          statusCode: 400,
        });
      }
      if (!mimeTypes.includes(ProductThumbnail.mimetype)) {
        return errorResponse(res, {
          message: `Only ${mimeTypes.map((i) =>
            i
              .split("/")
              .filter((i) => i !== "image")
              .join(" "),
          )} files are allowed`,
          statusCode: 400,
        });
      }
      if (fileSize(ProductThumbnail.size, maxSize)) {
        return errorResponse(res, {
          message: "Thumbnail size must be less than 5MB",
          statusCode: 400,
        });
      }
      oldThumbnail = product.productThumbnail;
      const thumbnailUpload = await cloudinaryImageUploader(
        ProductThumbnail,
        SHOCARTY_PRODUCT,
      );
      if (!isEmpty(thumbnailUpload)) {
        uploadPublicIds.push(thumbnailUpload.public_id);
        product.productThumbnail = thumbnailUpload.secure_url;
      }
    }
    const ProductImages = await ProductImage.find({
      productId: product._id,
    });
    const images = ProductImages.map((img) => img.Image);
    const removeImages = images.filter((img) => removedImages.includes(img));
    if (removedImages.length !== removeImages.length) {
      return errorResponse(res, {
        message: "Invalid image URL provided",
        statusCode: 400,
      });
    }
    const totalImages = images.length - removeImages.length + ProductImg.length;
    for (let img of ProductImg) {
      if (!img.mimetype.startsWith("image")) {
        return errorResponse(res, {
          message: "Only images are allowed",
          statusCode: 400,
        });
      }
      if (!mimeTypes.includes(img.mimetype)) {
        return errorResponse(res, {
          message: `Only ${mimeTypes.map((i) =>
            i
              .split("/")
              .filter((i) => i !== "image")
              .join(" "),
          )} files are allowed`,
          statusCode: 400,
        });
      }
      if (fileSize(img.size, maxSize)) {
        return errorResponse(res, {
          message: "Each image size must be less than 5MB",
          statusCode: 400,
        });
      }
    }
    if (totalImages < 1) {
      return errorResponse(res, {
        message: "Minimum 1 product image is required",
        statusCode: 400,
      });
    }
    if (totalImages > 4) {
      return errorResponse(res, {
        message: "Maximum 4 product images are required",
        statusCode: 400,
      });
    }
    let uploadImages = [];
    if (ProductImg.length > 0) {
      uploadImages = await Promise.all(
        ProductImg.map((img) => cloudinaryImageUploader(img, SHOCARTY_PRODUCT)),
      );
      uploadPublicIds.push(...uploadImages.map((i) => i.public_id));
    }
    session = await mongoose.startSession();
    session.startTransaction();
    await ProductImage.deleteMany(
      {
        productId: product._id,
        Image: { $in: removeImages },
      },
      { session },
    );
    const newDocs = uploadImages.map((res) => {
      return {
        productId: product._id,
        Image: res.secure_url,
      };
    });
    await product.save({ session });
    if (newDocs.length > 0) {
      await ProductImage.insertMany(newDocs, { session });
    }
    await session.commitTransaction();
    if (!isEmpty(oldThumbnail)) {
      await cloudinaryImageRemover(extractPublicIdFromUrl(oldThumbnail));
    }
    if (removeImages.length > 0) {
      await Promise.all(
        removeImages.map((url) => {
          return cloudinaryImageRemover(extractPublicIdFromUrl(url));
        }),
      );
    }
    const existingProduct = await Product.findById(product._id).lean();
    const AllProductImages = await ProductImage.find({
      productId: product._id,
    }).lean();
    existingProduct.images = AllProductImages.map((img) => img.Image);
    console.log("Product : updateProduct() : Exceution End");
    return successResponse(res, {
      data: { product: existingProduct },
      message: "Product updated successfully",
    });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    await Promise.all(
      uploadPublicIds.map((pid) => cloudinaryImageRemover(pid)),
    );
    console.log(`Error: ${error.message} failed to update Product`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export const deleteProduct = async (req, res) => {
  console.log("Product : deleteProduct() : Exceution Start");
  let allPublicIds = [];
  let session;
  let userId = req.user._id;
  try {
    const { productId } = req.body;
    if (!isValidMongoId(productId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    const product = await Product.findOne({ _id: productId, userId: userId });
    if (!product) {
      return errorResponse(res, {
        message: "Product not found",
        statusCode: 404,
      });
    }
    const productImage = await ProductImage.find({
      productId: product._id,
    }).lean();
    session = await mongoose.startSession();
    session.startTransaction();
    await Product.findByIdAndDelete(productId).session(session);
    await ProductImage.deleteMany({ productId: product._id }, { session });
    await session.commitTransaction();
    const productThumbnailPublicId = extractPublicIdFromUrl(
      product.productThumbnail,
    );
    allPublicIds.push(productThumbnailPublicId);
    const productImages = productImage.map((img) => img.Image);
    productImages.map((url) => allPublicIds.push(extractPublicIdFromUrl(url)));
    await Promise.all(allPublicIds.map((id) => cloudinaryImageRemover(id)));
    console.log("Product : deleteProduct() : Exceution End");
    return successResponse(res, { message: "Product deleted successfully" });
  } catch (error) {
    console.log(`Error: ${error.message} failed to delete Product`);
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export const getAllProducts = async (req, res) => {
  try {
    console.log("Product : getAllProducts() : Exceution Start");
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };
    const products = await Product.paginate({}, options);
    const data = {
      products: products.docs,
      total: products.totalDocs,
      page: products.page,
      totalPages: products.totalPages,
    };
    // if (data.products.length === 0) {
    //   return errorResponse(res, {
    //     message: "Products not found",
    //     statusCode: 404,
    //   });
    // }
    console.log("Product : getAllProducts() : Exceution End");
    return successResponse(res, {
      data: { ...data },
      message: "Products data fetched successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to get Products`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const searchFilter = async (req, res) => {
  try {
    let {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      search,
      categoryId,
      sort,
      price_min,
      price_max,
    } = req.query;
    page = Math.max(parseInt(page) || 1, 1);
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };
    const query = {};
    if (isValidMongoId(categoryId)) {
      query.categoryId = categoryId;
    }
    if (!isEmpty(search)) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { productDescription: { $regex: search, $options: "i" } },
      ];
    }
    const searchOptions = { createdAt: -1 };
    if (!isEmpty(parseInt(price_min)) || !isEmpty(parseInt(price_max))) {
      if (price_min > 0) {
        query.productPrice.$lte = parseInt(price_min);
      }
      if (price_max > 0) {
        query.productPrice.$gte = parseInt(price_max);
      }
    }
    const products = await Product.paginate(query, options);
    const data = {
      products: products.docs,
      total: products.totalDocs,
      page: products.page,
      totalPages: products.totalPages,
    };
    return successResponse(res, {
      data: { ...data },
      message: "Product searched succesfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to search products`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};
