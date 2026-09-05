import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { cloudinaryImageUploader } from "../utils/helpers/imageUploader.js";
import { cloudinaryImageRemover } from "../utils/helpers/imageRemover.js";
import { extractPublicIdFromUrl } from "../utils/helpers/extractPublicIdFromUrl.js";
import {
  fileSize,
  isEmpty,
  isValidEmail,
} from "../utils/validation/validate.js";
import { ENV } from "../configs/Env.js";
import { FILE_CONFIG } from "../constants/fileConfig.js";
import { APP_CONFIG } from "../constants/appConfig.js";
import { errorResponse, successResponse } from "../utils/helpers/response.js";
import { mailSender } from "../utils/helpers/mailSender.js";
import { contactUsForm } from "../utils/mail/templates/contactUsForm.js";

const { SHOCARTY_PROFILE } = ENV;
const { mimeTypes, maxSize } = FILE_CONFIG.IMAGE;
const {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  ROLE: { CUSTOMER },
} = APP_CONFIG;

export const updateProfile = async (req, res) => {
  try {
    console.log("User : updateProfile() : Exceution Start");
    const userId = req.user._id;
    const { firstName, lastName, gender, dateOfBirth, contactNumber, about } =
      req.body;
    const { image } = req.files || {};
    const Image = image ? (Array.isArray(image) ? image[0] : image) : null;
    if (isEmpty(firstName) || isEmpty(lastName)) {
      return errorResponse(res, {
        message: "First name and last name is required",
        statusCode: 400,
      });
    }
    if (Image) {
      if (!Image.mimetype.startsWith("image") || typeof Image !== "object") {
        return res.status(400).json({
          status: false,
          message: "Profile image must be an image",
        });
      }
      if (!mimeTypes.includes(image.mimetype)) {
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
      if (fileSize(image.size, maxSize)) {
        return errorResponse(res, {
          message: "Profile image size must be less than 5MB",
          statusCode: 400,
        });
      }
    }
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, {
        message: "User not registered",
        statusCode: 401,
      });
    }
    const profile = await Profile.findOne({ userId: userId });
    if (!isEmpty(gender)) {
      profile.gender = gender;
    }
    if (!isEmpty(dateOfBirth)) {
      profile.dateOfBirth = dateOfBirth;
    }
    if (!isEmpty(contactNumber)) {
      profile.contactNumber = contactNumber;
    }
    if (!isEmpty(gender)) {
      profile.gender = gender;
    }
    if (!isEmpty(about)) {
      profile.about = about;
    }
    let url;
    if (Image) {
      if (user.image.includes("res.cloudinary.com")) {
        await cloudinaryImageRemover(extractPublicIdFromUrl(user.image));
        url = await cloudinaryImageUploader(Image, SHOCARTY_PROFILE);
      } else {
        url = await cloudinaryImageUploader(Image, SHOCARTY_PROFILE);
      }
      user.image = url.secure_url;
    }
    if (!isEmpty(url)) {
      user.image = url.secure_url;
    }
    await user.save();
    await profile.save();
    const userData = await User.findById(userId)
      .select(
        "-isBlocked -resetPasswordExpires -resetPasswordToken -updatePassword -password",
      )
      .lean();
    const profileData = await Profile.findOne({ userId: userId }).lean();
    userData.additionalDetails = profileData;
    console.log("User : updateProfile() : Exceution End");
    return successResponse(res, {
      data: { user: userData },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to update profile`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    console.log("User : getUserDetails() : Exceution Start");
    const userId = req.user._id;
    const userExist = await User.findById(userId)
      .select(
        "-isBlocked -resetPasswordExpires -resetPasswordToken -updatePassword -password",
      )
      .lean();
    if (!userExist) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    const additionalDetails = await Profile.findOne({ userId: userExist._id });
    userExist.additionalDetails = additionalDetails;
    console.log("User : getUserDetails() : Exceution End");
    return res.status(200).json({
      data: { user: userExist },
      message: "User Data fetched successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to get user details`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const contactUs = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber, message } = req.body;
    if (
      isEmpty(firstName) ||
      isEmpty(lastName) ||
      isEmpty(contactNumber) ||
      isEmpty(message)
    ) {
      return errorResponse(res, {
        message: "All fields are required",
        statusCode: 400,
      });
    }
    if (!isValidEmail(email)) {
      return errorResponse(res, {
        message: "Invalid email",
        statusCode: 422,
      });
    }
    await mailSender(
      email,
      "SUBMITTED FORM",
      contactUsForm(email, firstName, lastName, contactNumber, message),
    );
    return successResponse(res, { message: "Form submitted successfully" });
  } catch (error) {
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    console.log("User : getUserDetails() : Exceution Start");
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;
    let query = {};
    query.role = CUSTOMER;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };
    const allUsers = await User.paginate(query, {
      ...options,
      lean: true,
      select:
        "-resetPasswordExpires -resetPasswordToken -updatePassword -password",
      leanWithId: false,
    });
    const data = {
      users: allUsers.docs,
      total: allUsers.totalDocs,
      page: allUsers.page,
      totalPages: allUsers.totalPages,
    };
    console.log("User : getUserDetails() : Exceution End");
    return res.status(200).json({
      data,
      message: "Users data fetched successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to get all users`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};
