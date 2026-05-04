import {
  createProduct,
  getProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  searchProductsAPI,
} from "../services/product.api";
import { useDispatch } from "react-redux";
import { setProducts, setAllProducts } from "../state/product.slice";
import { useState } from "react";

export const useProduct = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateProduct = async (formdata) => {
    try {
      const response = await createProduct(formdata);
      return response;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };

  const handleGetProducts = async () => {
    try {
      const response = await getProducts();
      dispatch(setProducts(response.products));
      return response;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };

  const handleGetAllProducts = async () => {
    try {
      const response = await getAllProducts();
      dispatch(setAllProducts(response.products));
      return response;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };

  const handleSearchProducts = async (query) => {
    try {
      const response = await searchProductsAPI(query);
      return response;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };

  const handleGetProductById = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProductById(id);
      return response;
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch product";
      setError(errorMsg);
      throw error?.response?.data || error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (id, formdata) => {
    try {
      const response = await updateProduct(id, formdata);
      return response;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await deleteProduct(id);
      return response;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };

  const handleToggleProductStatus = async (id) => {
    try {
      const response = await toggleProductStatus(id);
      return response;
    } catch (error) {
      throw error?.response?.data || error;
    }
  };

  return {
    handleCreateProduct,
    handleGetProducts,
    handleGetAllProducts,
    handleSearchProducts,
    handleGetProductById,
    handleUpdateProduct,
    handleDeleteProduct,
    handleToggleProductStatus,
    isLoading,
    error,
  };
};
