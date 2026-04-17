import { createProduct, getProducts, getAllProducts, getProductById, updateProduct, deleteProduct, toggleProductStatus } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setProducts, setAllProducts } from "../state/product.slice";

export const useProduct = () => {
     const dispatch = useDispatch();

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

     const handleGetProductById = async (id) => {
          try {
               const response = await getProductById(id);
               return response;
          } catch (error) {
               throw error?.response?.data || error;
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
        handleGetProductById,
        handleUpdateProduct,
        handleDeleteProduct,
        handleToggleProductStatus
    };
}