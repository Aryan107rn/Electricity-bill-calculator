import { useState, useCallback } from "react";
import { getBillHistory, deleteBill as apiDeleteBill } from "../services/api";
import toast from "react-hot-toast";

export function useBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBills = useCallback(async (params) => {
    setLoading(true);
    try {
      const res = await getBillHistory(params);
      setBills(res.data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeBill = useCallback(async (id) => {
    try {
      await apiDeleteBill(id);
      setBills((prev) => prev.filter((b) => b._id !== id));
      toast.success("Bill deleted");
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  return { bills, loading, fetchBills, removeBill };
}
