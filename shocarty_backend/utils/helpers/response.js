import { isEmpty } from "../validation/validate.js";

export const successResponse = (
  res,
  {
    data = null,
    status = true,
    message = "success",
    statusCode = 200,
    refreshTokencookie = null,
    accessTokencookie = null,
  } = {},
) => {
  const response = {};
  if (
    !isEmpty(refreshTokencookie?.name) &&
    !isEmpty(refreshTokencookie?.value)
  ) {
    res.cookie(
      refreshTokencookie.name,
      refreshTokencookie.value,
      refreshTokencookie.options,
    );
  }

  if (!isEmpty(accessTokencookie?.name) && !isEmpty(accessTokencookie?.value)) {
    res.cookie(
      accessTokencookie.name,
      accessTokencookie.value,
      accessTokencookie.options,
    );
  }
  if (!isEmpty(data)) response.data = data;
  response.status = status;
  response.message = message;
  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res,
  { error, status = false, message = "failed", statusCode = 500 } = {},
) => {
  const response = { error, status, message };
  if (error) response.error = error;
  return res.status(statusCode).json(response);
};
