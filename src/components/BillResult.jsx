import { Receipt, Zap, DollarSign, Percent, Layers, Download, Save } from "lucide-react";
import toast from "react-hot-toast";

const CHARGE_ICONS = {
  energy: <Zap size={14} />,
  fixed: <DollarSign size={14} />,
  tax: <Percent size={14} />,
  fuel: <Layers size={14} />,
  wheeling: <Zap size={14} />,
};

const CHARGE_LABELS = {
  energy: "Energy Charge",
  fixed: "Fixed Charge",
  tax: "Electricity Tax",
  fuel: "Fuel Surcharge",
  wheeling: "Wheeling Charge",
};

export default function BillResult({ result, meta, onSave, saving }) {
  if (!result) return null;
  const { breakdown, charges, totalAmount } = result;

  const handlePrint = () => {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>Electricity Bill</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; }
    h1 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #eee; font-size: 14px; }
    th { background: #f0f0ff; font-weight: 600; }
    .total { background: #6366f1; color: white; padding: 15px; text-align: center; border-radius: 8px; margin-top: 15px; }
    .total h2 { margin: 0; font-size: 28px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 15px; }
  </style>
</head>
<body>
  <h1>⚡ Electricity Bill — ElectraBill</h1>
  <p class="meta">State: ${meta?.state} | Type: ${meta?.connectionType} | Units: ${meta?.units} kWh | Month: ${meta?.month}</p>
  <h3>Slab Breakdown</h3>
  <table>
    <tr><th>Range</th><th>Units</th><th>Rate (₹)</th><th>Amount (₹)</th></tr>
    ${breakdown.map((r) => `<tr><td>${r.range} kWh</td><td>${r.units}</td><td>${r.rate}</td><td>${r.amount.toFixed(2)}</td></tr>`).join("")}
  </table>
  <h3>Charges</h3>
  <table>
    ${Object.entries(charges).map(([k, v]) => `<tr><td>${CHARGE_LABELS[k] || k}</td><td>₹${v.toFixed(2)}</td></tr>`).join("")}
  </table>
  <div class="total"><p>TOTAL BILL AMOUNT</p><h2>₹${totalAmount.toFixed(2)}</h2></div>
</body>
</html>`;
    const w = window.open("", "_blank");
    w.document.write(content);
    w.document.close();
    w.print();
  };

  return (
    <div className="result-enter" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Receipt size={18} color="var(--accent-2)" />
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Bill Breakdown</h2>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Download size={14} /> Print / PDF
          </button>
          {onSave && (
            <button className="btn btn-primary btn-sm" onClick={onSave} disabled={saving}>
              {saving ? <span className="spinner" /> : <Save size={14} />}
              {saving ? "Saving..." : "Save Bill"}
            </button>
          )}
        </div>
      </div>

      {/* Slab breakdown table */}
      <div className="card" style={{ padding: "1rem", overflow: "auto" }}>
        <p className="section-title"><Layers size={13} /> Slab Calculation</p>
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>Slab Range</th>
              <th>Units</th>
              <th>Rate (₹/kWh)</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((item, i) => (
              <tr key={i}>
                <td>{item.range} kWh</td>
                <td style={{ fontWeight: 600 }}>{item.units}</td>
                <td>₹{item.rate}</td>
                <td style={{ color: "var(--accent-2)", fontWeight: 600 }}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charges */}
      <div className="card" style={{ padding: "1rem" }}>
        <p className="section-title"><DollarSign size={13} /> Charges Summary</p>
        <div className="charges-list">
          {Object.entries(charges).map(([key, value]) => (
            <div className="charge-row" key={key}>
              <span className="charge-name">
                {CHARGE_ICONS[key] || <Zap size={14} />}
                {CHARGE_LABELS[key] || key}
              </span>
              <span className="charge-amount">₹{value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="total-display">
        <p className="total-label">Total Bill Amount</p>
        <p className="total-amount">₹{totalAmount.toFixed(2)}</p>
        <p className="total-meta">
          {meta?.state} · {meta?.connectionType} · {meta?.units} kWh · {meta?.month}
        </p>
      </div>
    </div>
  );
}
