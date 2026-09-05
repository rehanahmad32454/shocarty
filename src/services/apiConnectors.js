import { privateAxios, publicAxios } from "./axios";

export const privateConnector = async (
  method,
  url,
  bodyData,
  headers,
  params,
) => {
  return privateAxios({
    method,
    url,
    data: bodyData || null,
    headers: headers || {},
    params: params || {},
  })
};

export const publicConnector = async (
  method,
  url,
  bodyData,
  headers,
  params,
) => {
  return publicAxios({
    method,
    url,
    data: bodyData || null,
    headers: headers || {},
    params: params || {},
  })
};