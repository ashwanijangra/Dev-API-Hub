import axios from "axios";

const API_URL = "https://dev-api-hub-backend.onrender.com";

export const saveHistory = async (data: any) => {
  const token = localStorage.getItem("token");

  await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getHistory = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};