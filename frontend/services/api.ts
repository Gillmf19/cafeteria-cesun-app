const API_URL = "http://192.168.100.2:8000";

export const getStatus = async () => {
  const res = await fetch(`${API_URL}/`);
  return res.json();
};