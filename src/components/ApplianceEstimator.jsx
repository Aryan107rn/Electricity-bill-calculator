import { useState } from "react";
import { X, Plus, Trash2, Zap, RefreshCw } from "lucide-react";
import { estimateAppliances } from "../services/api";
import toast from "react-hot-toast";

const PRESETS = [
  { name: "LED Bulb", watts: 10, hoursPerDay: 6 },
  { name: "Fan", watts: 75, hoursPerDay: 12 },
  { name: "Refrigerator", watts: 150, hoursPerDay: 24 },
  { name: "Air Conditioner (1 ton)", watts: 1000, hoursPerDay: 8 },
  { name: "Washing Machine", watts: 500, hoursPerDay: 1 },
  { name: "Television (LED 40\")", watts: 80, hoursPerDay: 6 },
  { name: "Microwave", watts: 900, hoursPerDay: 0.5 },
  { name: "Water Heater", watts: 2000, hoursPerDay: 1 },
  { name: "Electric Iron", watts: 1000, hoursPerDay: 0.5 },
  { name: "Desktop Computer", watts: 250, hoursPerDay: 8 },
  { name: "WiFi Router", watts: 15, hoursPerDay: 24 },
  { name: "Water Pump", watts: 750, hoursPerDay: 2 },
];

export default function ApplianceEstimator({ onResult, onClose }) {
  const [appliances, setAppliances] = useState([
    { name: "LED Bulb", watts: 10, hoursPerDay: 6, quantity: 4 },
    { name: "Fan", watts: 75, hoursPerDay: 12, quantity: 2 },
    { name: "Refrigerator", watts: 150, hoursPerDay: 24, quantity: 1 },
  ]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const addPreset = (preset) => {
    const exists = appliances.find((a) => a.name === preset.name);
    if (exists) {
      setAppliances((prev) => prev.map((a) => a.name === preset.name ? { ...a, quantity: a.quantity + 1 } : a));
    } else {
      setAppliances((prev) => [...prev, { ...preset, quantity: 1 }]);
    }
  };

  const addCustom = () => {
    setAppliances((prev) => [...prev, { name: "Custom Appliance", watts: 100, hoursPerDay: 5, quantity: 1 }]);
  };

  const remove = (i) => setAppliances((prev) => prev.filter((_, idx) => idx !== i));

  const update = (i, field, value) => {
    setAppliances((prev) => prev.map((a, idx) => idx === i ? { ...a, [field]: field === "name" ? value : Number(value) } : a));
  };

  const estimate = async () => {
    setLoading(true);
    try {
      const res = await estimateAppliances({ appliances, days });
      setResult(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const useUnits = () => {
    if (result) {
      onResult(Math.round(result.totalUnits));
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={18} color="var(--accent-2)" />
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}>Appliance Estimator</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Presets */}
          <div>
            <p className="section-title">Quick Add Presets</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  className="btn btn-secondary btn-sm"
                  onClick={() => addPreset(p)}
                  style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
                >
                  + {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Days */}
          <div className="form-group">
            <label className="form-label">Billing Period (Days)</label>
            <input
              type="number"
              className="form-input"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              min={1}
              max={365}
              style={{ maxWidth: 120 }}
            />
          </div>

          {/* Appliance list */}
          <div>
            <p className="section-title" style={{ marginBottom: "0.5rem" }}>Your Appliances</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {appliances.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 80px 60px 36px",
                    gap: "0.5rem",
                    alignItems: "center",
                    padding: "0.5rem",
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <input
                    className="form-input"
                    style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                    value={a.name}
                    onChange={(e) => update(i, "name", e.target.value)}
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    className="form-input"
                    style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                    value={a.watts}
                    onChange={(e) => update(i, "watts", e.target.value)}
                    placeholder="Watts"
                    title="Watts"
                  />
                  <input
                    type="number"
                    className="form-input"
                    style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                    value={a.hoursPerDay}
                    onChange={(e) => update(i, "hoursPerDay", e.target.value)}
                    placeholder="Hrs/day"
                    title="Hours per day"
                    step={0.5}
                  />
                  <input
                    type="number"
                    className="form-input"
                    style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                    value={a.quantity}
                    onChange={(e) => update(i, "quantity", e.target.value)}
                    placeholder="Qty"
                    title="Quantity"
                    min={1}
                  />
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => remove(i)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {appliances.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "1rem" }}>No appliances added. Use presets or add manually.</p>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", color: "var(--text-muted)", fontSize: "0.72rem", padding: "0 0.5rem" }}>
              <span>Name</span>
              <span style={{ marginRight: "6rem" }}>Watts · Hrs/Day · Qty</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={addCustom} style={{ marginTop: "0.5rem" }}>
              <Plus size={13} /> Add Custom
            </button>
          </div>

          {/* Result */}
          {result && (
            <div style={{ background: "var(--gradient-card)", border: "1px solid var(--border-accent)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
              <p className="section-title" style={{ marginBottom: "0.75rem" }}>Estimated Consumption</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" }}>
                {result.appliances.map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{a.name} ×{a.quantity}</span>
                    <span style={{ color: "var(--accent-2)", fontWeight: 600 }}>{a.units} kWh</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Total: {result.totalUnits} kWh</span>
                <button className="btn btn-primary btn-sm" onClick={useUnits}>
                  Use this value
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={estimate} disabled={loading || appliances.length === 0}>
            {loading ? <><span className="spinner" /> Estimating...</> : <><RefreshCw size={15} /> Calculate</>}
          </button>
        </div>
      </div>
    </div>
  );
}
