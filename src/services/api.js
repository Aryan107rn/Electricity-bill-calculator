import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Response interceptor for clean error messages
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// Bills
export const calculateBill = (data) => api.post("/bills/calculate", data);
export const getBillHistory = (params) => api.get("/bills/history", { params });
export const deleteBill = (id) => api.delete(`/bills/${id}`);
export const getBillStats = () => api.get("/bills/stats");
export const estimateAppliances = (data) => api.post("/bills/estimate-appliances", data);

// States
export const getStates = () => api.get("/states");

export default api;
