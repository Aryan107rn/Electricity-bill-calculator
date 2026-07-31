import express from "express";
import {
  calculateBill,
  getBillHistory,
  deleteBill,
  getBillStats,
  estimateFromAppliances,
} from "../controllers/billController.js";

const router = express.Router();

router.post("/calculate", calculateBill);
router.get("/history", getBillHistory);
router.get("/stats", getBillStats);
router.post("/estimate-appliances", estimateFromAppliances);
router.delete("/:id", deleteBill);

export default router;
