export const setLocalFormData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  export const getLocalFormData = key => {
    return JSON.parse(localStorage.getItem(key));
  };
  
  export const removeLocalFormData = key => {
    localStorage.removeItem(key);
  };