import axios from 'axios';

const productInstance = axios.create({
     baseURL : "http://localhost:3000/api/products",
     withCredentials : true,
});

export const createProduct = async (formdata) => {
     try {
          const response = await productInstance.post("/", formdata);
          return response.data;
     } catch (error) {
          console.error("Error creating product:", error);
          throw error;
     }
};

export const getProducts = async () => {
     try {
          const response = await productInstance.get("/get-seller-products");
          return response.data;
     } catch (error) {
          console.error("Error fetching products:", error);
          throw error;
     }
};

export const getAllProducts = async () => {
     try {
          const response = await productInstance.get("/allproducts");
          return response.data;
     } catch (error) {
          console.error("Error fetching all products:", error);
          throw error;
     }
};

export const searchProductsAPI = async (query) => {
     try {
          const response = await productInstance.get(`/search?q=${encodeURIComponent(query)}`);
          return response.data;
     } catch (error) {
          console.error("Error searching products:", error);
          throw error;
     }
};

export const getProductById = async (id) => {
     try {
          const response = await productInstance.get(`/${id}`);
          return response.data;
     } catch (error) {
          console.error("Error fetching product:", error);
          throw error;
     }
};

export const updateProduct = async (id, formdata) => {
     try {
          const response = await productInstance.put(`/${id}`, formdata);
          return response.data;
     } catch (error) {
          console.error("Error updating product:", error);
          throw error;
     }
};

export const deleteProduct = async (id) => {
     try {
          const response = await productInstance.delete(`/${id}`);
          return response.data;
     } catch (error) {
          console.error("Error deleting product:", error);
          throw error;
     }
};

export const toggleProductStatus = async (id) => {
     try {
          const response = await productInstance.patch(`/${id}/toggle-active`);
          return response.data;
     } catch (error) {
          console.error("Error toggling product status:", error);
          throw error;
     }
};