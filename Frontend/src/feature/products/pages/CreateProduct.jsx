import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import ProductForm from "../components/ProductForm";

export default function CreateProduct() {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      await handleCreateProduct(formData);
      navigate("/seller");
    } catch (err) {
      setError(err?.message || "Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductForm 
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      title="Create Workspace"
      subtitle="Add a new piece to your collection"
    />
  );
}
