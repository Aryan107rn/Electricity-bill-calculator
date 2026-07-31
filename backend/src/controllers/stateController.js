import { SUPPORTED_STATES, STATE_SLABS, CONNECTION_TYPES } from "../config/states.js";

// GET /api/states
export const getStates = (req, res) => {
  const states = SUPPORTED_STATES.map((name) => ({
    name,
    types: CONNECTION_TYPES.map((type) => {
      const data = STATE_SLABS[name][type];
      return {
        type,
        slabs: data.slabs.map((s) => ({
          ...s,
          max: s.max === Infinity ? "∞" : s.max,
        })),
        fixedCharge: data.fixedCharge,
        taxRate: `${(data.taxRate * 100).toFixed(0)}%`,
      };
    }),
  }));
  res.json({ success: true, data: states });
};
