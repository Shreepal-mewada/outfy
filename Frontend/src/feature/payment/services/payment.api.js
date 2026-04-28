import axios from "axios";

const paymentInstance = axios.create({
  baseURL: "http://localhost:3000/api/payment",
  withCredentials: true,
});

export const createOrder = async () => {
  try {
    const response = await paymentInstance.post("/create-order");
    return response.data;
  } catch (error) {
    console.error("Error creating payment order:", error);
    throw error;
  }
};

export const verifyPayment = async (verificationData) => {
  try {
    const response = await paymentInstance.post("/verify", verificationData);
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};
