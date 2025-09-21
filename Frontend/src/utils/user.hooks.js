// hooks/useLogout.js
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useHandleLogout = () => {
  const navigate = useNavigate();

  const userLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return userLogout;
};
