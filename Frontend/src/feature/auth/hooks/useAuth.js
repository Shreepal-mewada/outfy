import { register, login, googleLogin, logout } from "../service/auth.api";
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
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, error: error?.message || "Something went wrong" };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGoogleAuth(token) {
    dispatch(setLoading(true));
    try {
      const response = await googleLogin(token);
      dispatch(setUser(response.user));
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Google logic failed:", error);
      return { success: false, error: error?.message || "Google Authentication failed" };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    dispatch(setLoading(true));
    try {
      const response = await login({ email, password });
      dispatch(setUser(response.user));
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error?.message || "Invalid credentials" };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    dispatch(setLoading(true));
    try {
      const response = await logout();
      dispatch(setUser(null));
      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      return { success: false, error: error?.message || "Logout failed" };
    } finally {
      dispatch(setLoading(false));
    }
  }



  return { handleLogin, handleGoogleAuth, handleLogout, handleRegister };
}








