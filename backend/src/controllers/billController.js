import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Bill from "../models/Bill.js";
import { getCalculator } from "../utils/calculator.js";

const fallbackPath = join(dirname(fileURLToPath(import.meta.url)), "../../data/bills.json");
let pendingWrite = Promise.resolve();

const readFallbackBills = async () => {
  try {
    return JSON.parse(await readFile(fallbackPath, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
};

const addFallbackBill = async (bill) => {
  const update = pendingWrite.then(async () => {
    const bills = await readFallbackBills();
    await mkdir(dirname(fallbackPath), { recursive: true });
    await writeFile(fallbackPath, JSON.stringify([bill, ...bills], null, 2));
  });
  pendingWrite = update.catch(() => {});
  await update;
};

const deleteFallbackBill = async (id) => {
  let found = false;
  const update = pendingWrite.then(async () => {
    const bills = await readFallbackBills();
    const filtered = bills.filter((bill) => bill._id !== id);
    found = filtered.length !== bills.length;
    if (found) {
      await mkdir(dirname(fallbackPath), { recursive: true });
      await writeFile(fallbackPath, JSON.stringify(filtered, null, 2));
    }
  });
  pendingWrite = update.catch(() => {});
  await update;
  return found;
};

const fallbackStats = (bills) => {
  const sum = (items) => items.reduce((total, bill) => total + bill.totalAmount, 0);
  const groupBy = (key) => Object.values(bills.reduce((groups, bill) => {
    const name = bill[key];
    const group = groups[name] || (groups[name] = { _id: name, count: 0, totalSpend: 0, avgUnits: 0 });
    group.count += 1;
    group.totalSpend += bill.totalAmount;
    group.avgUnits += bill.units;
    return groups;
  }, {})).map((group) => ({ ...group, avgUnits: group.avgUnits / group.count }));
  const totals = bills.map((bill) => bill.totalAmount);
  return {
    overview: {
      totalBills: bills.length,
      totalSpend: sum(bills),
      avgBill: bills.length ? sum(bills) / bills.length : 0,
      maxBill: bills.length ? Math.max(...totals) : 0,
      minBill: bills.length ? Math.min(...totals) : 0,
      totalUnits: bills.reduce((total, bill) => total + bill.units, 0),
    },
    byType: groupBy("connectionType"),
    byState: groupBy("state").sort((a, b) => b.totalSpend - a.totalSpend),
    recent: bills.slice(0, 10),
  };
};

// POST /api/bills/calculate
export const calculateBill = async (req, res, next) => {
  try {
    const { state = "Maharashtra", connectionType = "domestic", units, month } = req.body;

    if (units === undefined || units === null || isNaN(Number(units))) {
      return res.status(400).json({ success: false, message: "Valid units value is required" });
    }
    if (Number(units) < 0) {
      return res.status(400).json({ success: false, message: "Units cannot be negative" });
    }

    const calculator = getCalculator(state, connectionType, Number(units));
    const result = calculator.calculateTotal();

    const billData = {
      state,
      connectionType,
      units: Number(units),
      breakdown: result.breakdown,
      charges: result.charges,
      totalAmount: result.totalAmount,
      month: month || new Date().toLocaleString("default", { month: "long", year: "numeric" }),
    };

    let bill;
    
    // Only try to save if DB is connected to avoid 10s timeouts
    if (mongoose.connection.readyState === 1) {
      try {
        bill = await Bill.create(billData);
      } catch (dbErr) {
        console.warn("Could not save to DB:", dbErr.message);
        bill = { ...billData, _id: randomUUID(), createdAt: new Date().toISOString() };
        await addFallbackBill(bill);
      }
    } else {
      bill = { ...billData, _id: randomUUID(), createdAt: new Date().toISOString() };
      await addFallbackBill(bill);
    }

    res.status(201).json({ success: true, data: bill });
  } catch (err) {
    next(err);
  }
};

// GET /api/bills/history
export const getBillHistory = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const bills = await readFallbackBills();
      const { state, connectionType, limit = 50 } = req.query;
      const filtered = bills.filter((bill) => (!state || bill.state === state) && (!connectionType || bill.connectionType === connectionType));
      return res.json({ success: true, count: filtered.length, data: filtered.slice(0, parseInt(limit, 10) || 50) });
    }

    const { state, connectionType, limit = 50 } = req.query;
    const filter = {};
    if (state) filter.state = state;
    if (connectionType) filter.connectionType = connectionType;

    const bills = await Bill.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, count: bills.length, data: bills });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/bills/:id
export const deleteBill = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!await deleteFallbackBill(req.params.id)) return res.status(404).json({ success: false, message: "Bill not found" });
      return res.json({ success: true, message: "Bill deleted successfully" });
    }
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }
    res.json({ success: true, message: "Bill deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// GET /api/bills/stats
export const getBillStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const bills = await readFallbackBills();
      return res.json({
        success: true,
        data: fallbackStats(bills),
      });
    }

    const [agg] = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          totalSpend: { $sum: "$totalAmount" },
          avgBill: { $avg: "$totalAmount" },
          maxBill: { $max: "$totalAmount" },
          minBill: { $min: "$totalAmount" },
          totalUnits: { $sum: "$units" },
        },
      },
    ]);

    const byType = await Bill.aggregate([
      { $group: { _id: "$connectionType", count: { $sum: 1 }, totalSpend: { $sum: "$totalAmount" }, avgUnits: { $avg: "$units" } } },
    ]);

    const byState = await Bill.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 }, totalSpend: { $sum: "$totalAmount" } } },
      { $sort: { totalSpend: -1 } },
    ]);

    const recent = await Bill.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("totalAmount units connectionType state createdAt month");

    res.json({
      success: true,
      data: {
        overview: agg || { totalBills: 0, totalSpend: 0, avgBill: 0, maxBill: 0, minBill: 0, totalUnits: 0 },
        byType,
        byState,
        recent,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/bills/estimate-appliances
export const estimateFromAppliances = async (req, res, next) => {
  try {
    const { appliances, days = 30 } = req.body;
    if (!Array.isArray(appliances) || appliances.length === 0) {
      return res.status(400).json({ success: false, message: "Appliances list required" });
    }

    let totalUnits = 0;
    const breakdown = appliances.map((a) => {
      const watts = Number(a.watts) || 0;
      const hoursPerDay = Number(a.hoursPerDay) || 0;
      const quantity = Number(a.quantity) || 1;
      const units = (watts * hoursPerDay * quantity * days) / 1000;
      totalUnits += units;
      return { name: a.name, watts, hoursPerDay, quantity, units: parseFloat(units.toFixed(2)) };
    });

    res.json({
      success: true,
      data: {
        appliances: breakdown,
        totalUnits: parseFloat(totalUnits.toFixed(2)),
        days,
      },
    });
  } catch (err) {
    next(err);
  }
};
