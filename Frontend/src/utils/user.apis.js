import axios from "axios";

export const logoutUser = async () => {
  return axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
    withCredentials: true,
  });
};
