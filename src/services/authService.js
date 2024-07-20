import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const signup = async (email, password) => {
  const response = await axios.post(`${API_URL}/signup`, {
    email,
    password,
  });
  return response.data;
};
