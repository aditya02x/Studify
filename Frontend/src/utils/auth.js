export const getToken = () => {
  return localStorage.getItem("token");
};

// --- ADD THESE NEW FUNCTIONS ---

export const getname = () => {
  return localStorage.getItem("name") || "User";
};

export const setSession = (token, name) => {
  localStorage.setItem("token", token);
  localStorage.setItem("name", name);
};

// -------------------------------

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name"); // Clear the name too!
};