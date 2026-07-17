import axios from "axios";

export const executeRequest = async (
  method: string,
  url: string,
  body: any,
  headers: any[],
  params: any[],
  token: string
) => {
  const requestHeaders: Record<string, string> = {};

  headers.forEach((item) => {
    if (item.key && item.value) {
      requestHeaders[item.key] = item.value;
    }
  });

  if (token.trim()) {
    requestHeaders.Authorization =
      `Bearer ${token}`;
  }

  const requestParams: Record<
    string,
    string
  > = {};

  params.forEach((item) => {
    if (item.key && item.value) {
      requestParams[item.key] =
        item.value;
    }
  });

  const start = performance.now();

  const response = await axios({
    method,
    url,
    data: body,
    headers: requestHeaders,
    params: requestParams,
    validateStatus: () => true,
  });

  const end = performance.now();

  return {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    time: Math.round(end - start),
    responseHeaders: response.headers as Record<string, string>,
  };
};