import mongoose from "mongoose";

const breakdownItemSchema = new mongoose.Schema(
  {
    range: { type: String, required: true },
    units: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, default: "Maharashtra" },
    connectionType: {
      type: String,
      enum: ["domestic", "commercial", "industrial"],
      required: true,
    },
    units: { type: Number, required: true, min: 0 },
    breakdown: [breakdownItemSchema],
    charges: {
      energy: { type: Number, required: true },
      fixed: { type: Number, default: 0 },
      tax: { type: Number, required: true },
      wheeling: { type: Number, default: 0 },
      fuel: { type: Number, default: 0 },
    },
    totalAmount: { type: Number, required: true },
    month: { type: String, default: () => new Date().toLocaleString("default", { month: "long", year: "numeric" }) },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
