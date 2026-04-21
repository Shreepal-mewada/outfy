import axios from 'axios';

const cartInstance = axios.create({
     baseURL : "http://localhost:3000/api/cart",
     withCredentials : true,
});

export const getCart = async () => {
     try {
          const response = await cartInstance.get("/");
          return response.data;
     } catch (error) {
          console.error("Error fetching cart:", error);
          throw error;
     }
};

export const addToCart = async (productId, quantity = 1) => {
     try {
          const response = await cartInstance.post("/add", { productId, quantity });
          return response.data;
     } catch (error) {
          console.error("Error adding to cart:", error);
          throw error;
     }
};

export const updateCartItem = async (productId, quantity) => {
     try {
          const response = await cartInstance.put("/update", { productId, quantity });
          return response.data;
     } catch (error) {
          console.error("Error updating cart item:", error);
          throw error;
     }
};

export const removeFromCart = async (productId) => {
     try {
          const response = await cartInstance.delete(`/${productId}`);
          return response.data;
     } catch (error) {
          console.error("Error removing from cart:", error);
          throw error;
     }
};
