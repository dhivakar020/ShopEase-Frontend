import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Adjust the URL as per your backend

export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories/`);
  return response.data;
};

export const fetchProductsByCategory = async (categoryId) => {
  const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/products/`);
  return response.data;
};