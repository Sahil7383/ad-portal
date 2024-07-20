import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const createAd = async (formData, token) => {
  const response = await axios.post(`${API_URL}/ads/create`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAds = async (token) => {
  const response = await axios.get(`${API_URL}/ads/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
