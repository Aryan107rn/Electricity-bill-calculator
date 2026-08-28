import { useState, useEffect } from "react";
import { Calculator, MapPin, Plug, Gauge, Cpu, ChevronDown } from "lucide-react";
import SlabCard from "../components/SlabCard";
import BillResult from "../components/BillResult";
import ApplianceEstimator from "../components/ApplianceEstimator";
import { calculateBill, getStates } from "../services/api";
import toast from "react-hot-toast";

const TYPE_COLORS = { domestic: "var(--accent-2)", commercial: "var(--accent-yellow)", industrial: "var(--accent-cyan)" };

export default function CalculatorPage() {
  const [state, setState] = useState("Maharashtra");
  const [connectionType, setConnectionType] = useState("domestic");
  const [units, setUnits] = useState(150);
  const [month, setMonth] = useState(() => new Date().toLocaleString("default", { month: "long", year: "numeric" }));
  const [statesData, setStatesData] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEstimator, setShowEstimator] = useState(false);

  // Load states from backend
  useEffect(() => {
    getStates()
      .then((res) => setStatesData(res.data || []))
      .catch(() => {});
  }, []);

  const currentStateData = statesData.find((s) => s.name === state);
  const currentTypeData = currentStateData?.types?.find((t) => t.type === connectionType);
  const slabs = currentTypeData?.slabs || [];

  const handleCalculate = async () => {
    if (!units || isNaN(units) || Number(units) < 0) {
      toast.error("Please enter valid units");
      return;
    }
    setLoading(true);
    try {
      // Calculate locally for instant feedback, then save via the calculate endpoint
      const res = await calculateBill({ state, connectionType, units: Number(units), month });
      const bill = res.data;
      setResult({
        breakdown: bill.breakdown,
        charges: bill.charges,
        totalAmount: bill.totalAmount,
        _id: bill._id,
      });
      toast.success("Bill calculated & saved!", { icon: "⚡" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const MONTHS = [
    "January 2026","February 2026","March 2026","April 2026",
    "May 2026","June 2026","July 2026","August 2026",
    "September 2026","October 2026","November 2026","December 2026",
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">⚡ Bill Calculator</h1>
        <p className="page-subtitle">Instant electricity bill with slab-wise breakdown for major Indian states</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* Left: Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* State + Type + Month */}
          <div className="card">
            <p className="section-title" style={{ marginBottom: "1rem" }}><MapPin size={13} /> Connection Details</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group">
                <label className="form-label"><MapPin size={12} /> State</label>
                <div className="select-wrap">
                  <select
                    className="form-select"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setResult(null);
                    }}
                  >
                    {statesData.length > 0
                      ? statesData.map((s) => <option key={s.name}>{s.name}</option>)
                      : ["Maharashtra","Delhi","Karnataka","Gujarat","Uttar Pradesh"].map((s) => <option key={s}>{s}</option>)
                    }
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label"><Plug size={12} /> Connection Type</label>
                <div className="select-wrap">
                  <select
                    className="form-select"
                    value={connectionType}
                    onChange={(e) => {
                      setConnectionType(e.target.value);
                      setResult(null);
                    }}
                  >
                    <option value="domestic">🏠 Domestic</option>
                    <option value="commercial">🏢 Commercial</option>
                    <option value="industrial">🏭 Industrial</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">📅 Billing Month</label>
                <div className="select-wrap">
                  <select className="form-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                    {MONTHS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Units Input */}
          <div className="card">
            <p className="section-title" style={{ marginBottom: "1rem" }}><Gauge size={13} /> Units Consumed</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div className="input-group">
                <input
                  type="number"
                  className="form-input"
                  value={units}
                  onChange={(e) => {
                    setUnits(e.target.value);
                    setResult(null);
                  }}
                  min={0}
                  max={10000}
                  placeholder="Enter units"
                />
                <span className="input-suffix">kWh</span>
              </div>
              <div className="range-wrap">
                <input
                  type="range"
                  min={0} max={2000} step={10}
                  value={Math.min(units, 2000)}
                  onChange={(e) => {
                    setUnits(Number(e.target.value));
                    setResult(null);
                  }}
                  style={{
                    background: `linear-gradient(to right, var(--accent-1) ${(Math.min(units, 2000) / 2000) * 100}%, var(--bg-secondary) 0%)`
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  <span>0</span><span>500</span><span>1000</span><span>1500</span><span>2000+</span>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ alignSelf: "flex-start" }}
                onClick={() => setShowEstimator(true)}
              >
                <Cpu size={13} /> Estimate from appliances
              </button>
            </div>
          </div>

          {/* Slab Rates */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <p className="section-title" style={{ margin: 0 }}>Slab Rates</p>
              <span
                className={`badge badge-${connectionType}`}
                style={{ textTransform: "capitalize" }}
              >
                {connectionType}
              </span>
            </div>
            {slabs.length > 0 ? (
              <SlabCard slabs={slabs} activeUnits={Number(units)} />
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading slab data…</p>
            )}
            {currentTypeData && (
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", padding: "0.75rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <span>Fixed: <strong style={{ color: "var(--text-primary)" }}>₹{currentTypeData.fixedCharge}</strong></span>
                <span>Tax: <strong style={{ color: "var(--text-primary)" }}>{currentTypeData.taxRate}</strong></span>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <button
            className="btn btn-primary btn-lg btn-full animate-pulse-glow"
            onClick={handleCalculate}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} /> Calculating...</>
            ) : (
              <><Calculator size={18} /> Calculate Bill</>
            )}
          </button>
        </div>

        {/* Right: Result */}
        <div>
          {result ? (
            <BillResult
              result={result}
              meta={{ state, connectionType, units, month }}
            />
          ) : (
            <div className="card" style={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="empty-state">
                <div className="empty-icon">⚡</div>
                <p className="empty-title">Your bill will appear here</p>
                <p className="empty-desc">Fill in the details and click "Calculate Bill"</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appliance Estimator Modal */}
      {showEstimator && (
        <ApplianceEstimator
          onResult={(u) => {
            setUnits(u);
            setResult(null);
          }}
          onClose={() => setShowEstimator(false)}
        />
      )}

      <style>{`
        @media (max-width: 800px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
