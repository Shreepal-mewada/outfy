import axios from "axios";

const bseURL = axios.create({
  baseURL: "http://localhost:3000/auth",
  withCredentials: true,
});

export async function register({
  fullname,
  contact,
  email,
  password,
  isSeller,
}) {
  try {
    const response = await bseURL.post("/register", {
      fullname,
      contact,
      email,
      password,
      isSeller,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export async function login({ email, password }) {
  try {
    const response = await bseURL.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  } 
}