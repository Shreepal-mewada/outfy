import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useProduct } from "../hooks/useProduct";
import ProductForm from "../components/ProductForm";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleUpdateProduct, handleGetProductById } = useProduct();
  
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await handleGetProductById(id);
        if (res.product) {
          setInitialData(res.product);
        }
      } catch (err) {
         setError("Failed to fetch product details.");
      } finally {
         setIsFetching(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      await handleUpdateProduct(id, formData);
      navigate("/seller");
    } catch (err) {
      setError(err?.message || "Failed to update product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1A1C19] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ProductForm 
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      title="Edit Workspace"
      subtitle="Update listing details"
    />
  );
}
