import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { isEmpty, isValidMongoId } from "../utils/validation/validate.js";
import { errorResponse, successResponse } from "../utils/helpers/response.js";
import { APP_CONFIG } from "../constants/appConfig.js";

const { DEFAULT_PAGE, DEFAULT_LIMIT, CATEGORY_LIMIT, CATEGORY_PRODUCT_LIMIT } =
  APP_CONFIG;

export const addCategory = async (req, res) => {
  try {
    console.log("Category : addCategory() : Exceution Start");
    const { categoryName, description } = req.body;
    if (isEmpty(categoryName)) {
      return errorResponse(res, {
        message: "Category name is required",
        statusCode: 400,
      });
    }
    const totCat = await Category.countDocuments();
    if (totCat > 20) {
      return errorResponse(res, {
        message: "Maxiumum 20 category can be added",
        statusCode: 400,
      });
    }
    const categoryname = categoryName.trim().toLowerCase();
    let isCatExist = await Category.findOne({
      categoryName: categoryname.toUpperCase(),
    });
    if (isCatExist) {
      return errorResponse(res, {
        message: "Category already exist",
        statusCode: 409,
      });
    }
    const category = await Category.create({
      categoryName: categoryname,
      description,
    });
    console.log("Category : addCategory() : Exceution End");
    return successResponse(res, {
      data: { category },
      statusCode: 201,
      message: "Category added successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to add category`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    console.log("Category : getCategory() : Exceution Start");
    const category = await Category.find({})
    if (!category) {
      return errorResponse(res, {
        message: "Category is empty",
        statusCode: 404,
      });
    }
    console.log("Category : getCategory() : Exceution End");
    return successResponse(res, {
        data: { category },
        statusCode: 200,
        message: "Category data fetched successfully",
      });
  } catch (error) {
    console.log(`Error: ${error.message} failed to get category`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const editCategory = async (req, res) => {
  try {
    console.log("Category : editCategory() : Exceution Start");
    const { categoryId, categoryName, description } = req.body;
    if (!isValidMongoId(categoryId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return errorResponse(res, {
        message: "Category not exist",
        statusCode: 404,
      });
    }
    if (!isEmpty(categoryName)) {
      category.categoryName = categoryName.toUpperCase();
    }
    if (!isEmpty(description)) {
      category.description = description;
    }
    const newCat = await category.save();
    console.log("Category : editCategory() : Exceution End");
    return successResponse(res, {
      data: { category: newCat },
      message: "Category data updated successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to edit category`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    console.log("Category : deleteCategory() : Exceution Start");
    const { categoryId } = req.body;
    if (!isValidMongoId(categoryId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    const delCat = await Category.findOneAndUpdate(
      { _id: categoryId, deleted: false },
      { deleted: true },
      { new: true },
    );
    if (!delCat) {
      return errorResponse(res, {
        message: "Category not exist",
        statusCode: 404,
      });
    }
    console.log("Category : deleteCategory() : Exceution End");
    return successResponse(res, { message: "Category deleted successfully" });
  } catch (error) {
    console.log(`Error: ${error.message} failed to delete category`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const paginateCategory = async (req, res) => {
  try {
    console.log("Category : paginateCategory() : Exceution Start");
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;
    let query = {};
    query.deleted = { $in: [false] };
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };
    const categories = await Category.paginate(query, options);
    const data = {
      categories: categories.docs,
      total: categories.totalDocs,
      page: categories.page,
      totalPages: categories.totalPages,
    };
    console.log("Category : paginateCategory() : Exceution End");
    return successResponse(res, {
      data: {
        categories: data.categories,
        total: categories.totalDocs,
        page: categories.page,
        totalPages: categories.totalPages,
      },
      message: "Category data fetched successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to paginate category`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const categoryShowCase = async (req, res) => {
  try {
    console.log("Category : categoryShowCase() : Exceution Start");
    const categories = await Category.find({ deleted: false })
      .limit(CATEGORY_LIMIT)
      .lean();
    if (isEmpty(categories)) {
      return errorResponse(res, {
        message: "Category not exist",
        statusCode: 404,
      });
    }
    const data = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ categoryId: cat._id })
          .limit(CATEGORY_PRODUCT_LIMIT)
          .sort({ createdAt: -1 })
          .lean();
        const totalProducts = await Product.countDocuments({
          categoryId: cat._id,
        });
        return {
          _id: cat._id,
          categoryName: cat.categoryName,
          totalProducts,
          products,
        };
      }),
    );
    console.log("Category : categoryShowCase() : Exceution End");
    return successResponse(res, {
      data: { data },
      message: "Category with product data fetched successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to load category showcase`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};
