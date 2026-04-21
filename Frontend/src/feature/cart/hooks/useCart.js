import { getCart, addToCart, updateCartItem, removeFromCart } from "../services/cart.api";
import { useDispatch } from "react-redux";
import { setCart, addItem, updateItem, removeItem, setLoading, setError } from "../state/cart.slice";

export const useCart = () => {
     const dispatch = useDispatch();

     const handleGetCart = async () => {
          try {
               dispatch(setLoading(true));
               const response = await getCart();
               dispatch(setCart(response));
               return response;
          } catch (error) {
               dispatch(setError(error?.response?.data?.message || error.message));
               throw error?.response?.data || error;
          } finally {
               dispatch(setLoading(false));
          }
     };

     const handleAddToCart = async (productId, quantity = 1) => {
          try {
               dispatch(setLoading(true));
               const response = await addToCart(productId, quantity);
               dispatch(setCart(response));
               return response;
          } catch (error) {
               dispatch(setError(error?.response?.data?.message || error.message));
               throw error?.response?.data || error;
          } finally {
               dispatch(setLoading(false));
          }
     };

     const handleUpdateCartItem = async (productId, quantity) => {
          try {
               dispatch(setLoading(true));
               const response = await updateCartItem(productId, quantity);
               dispatch(setCart(response));
               return response;
          } catch (error) {
               dispatch(setError(error?.response?.data?.message || error.message));
               throw error?.response?.data || error;
          } finally {
               dispatch(setLoading(false));
          }
     };

     const handleRemoveFromCart = async (productId) => {
          try {
               dispatch(setLoading(true));
               const response = await removeFromCart(productId);
               dispatch(setCart(response));
               return response;
          } catch (error) {
               dispatch(setError(error?.response?.data?.message || error.message));
               throw error?.response?.data || error;
          } finally {
               dispatch(setLoading(false));
          }
     };

     return { 
          handleGetCart, 
          handleAddToCart, 
          handleUpdateCartItem, 
          handleRemoveFromCart 
     };
};
