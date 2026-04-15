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