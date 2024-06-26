export const addToLocalStorage = (key, value) => localStorage.setItem(key, value);
export const removeFromLocalStorage = (key) => localStorage.removeItem(key);
export const getFromLocalStorage = (key) => localStorage.getItem(key);