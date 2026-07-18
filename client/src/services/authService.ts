import axios from "axios";

import type{
  RegisterData,
  LoginData,
} from "../types/authTypes";

const API_URL =
      "https://dev-api-hub-backend.onrender.com/api/auth";

export const registerUser = async (
  userData: RegisterData
) => {
  const response = await axios.post(
    `${API_URL}/register`,
    userData
  );

  return response.data;
};

export const loginUser = async (
  userData: LoginData
) => {
  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );

  return response.data;
};