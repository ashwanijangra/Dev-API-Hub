import axios from "axios";

const API_URL = "https://dev-api-hub-backend.onrender.com";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const saveCollection = async (data: any) => {
  const response = await axios.post(
    API_URL,
    data,
    getAuthHeader()
  );

  return response.data;
};

export const getCollections = async () => {
  const response = await axios.get(
    API_URL,
    getAuthHeader()
  );

  return response.data;
};

export const deleteCollection = async (
  id: string
) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeader()
  );

  return response.data;
};

export const updateCollection = async (
  id: string,
  data: any
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    data,
    getAuthHeader()
  );

  return response.data;
};