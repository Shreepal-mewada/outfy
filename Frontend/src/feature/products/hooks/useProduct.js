import { createProduct , getProducts } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setProducts } from "../state/product.slice";
export const useProduct = () => {
     const dispatch = useDispatch();



      
     const handleCreateProduct = async (formdata) => {
          try {
               const response = await createProduct(formdata);
               return response;
          } catch (error) {
               console.error("Error creating product:", error);
               throw error;
          }
      };

      const handleGetProducts = async () => {
          try {
               const response = await getProducts();
                dispatch(setProducts(response.products));
               return response;
          } catch (error) {
               console.error("Error fetching products:", error);
               throw error;
               
          }
    }
  

    return { handleCreateProduct, handleGetProducts };
  }