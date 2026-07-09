const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const TOKEN_KEY = "auth_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else removeToken();
};

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const authHeaders = (extra = {}) => {
  const token = getToken();
  return token
    ? { ...extra, Authorization: `Bearer ${token}` }
    : extra;
};

export default API_BASE;
