import { register, login } from "../service/auth.api";
import { setLoading, setUser } from "../state/auth.slice";
import { useDispatch } from "react-redux";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({
    fullname,
    contact,
    email,
    password,
    isSeller = false,
  }) {
    dispatch(setLoading(true));
    try {
      const response = await register({
        fullname,
        contact,
        email,
        password,
        isSeller,
      });
      dispatch(setUser(response.user));
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, error: error?.message || "Something went wrong" };
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister };
}

export function useLogin() {
  const dispatch = useDispatch();

  async function handleLogin({ email, password }) {
    dispatch(setLoading(true));
    try {
      const response = await login({ email, password });
      dispatch(setUser(response.user));
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error?.message || "Invalid credentials" };
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleLogin };
}