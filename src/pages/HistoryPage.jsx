import { useEffect, useState } from "react";
import { History, Trash2, Filter, RefreshCw, MapPin, Zap } from "lucide-react";
import { useBills } from "../hooks/useBills";

const TYPE_BADGE = { domestic: "badge-domestic", commercial: "badge-commercial", industrial: "badge-industrial" };

export default function HistoryPage() {
  const { bills, loading, fetchBills, removeBill } = useBills();
  const [filterState, setFilterState] = useState("");
  const [filterType, setFilterType] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBills({ state: filterState || undefined, connectionType: filterType || undefined });
  }, [filterState, filterType]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await removeBill(id);
    setDeletingId(null);
  };

  const totalSpend = bills.reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📋 Bill History</h1>
        <p className="page-subtitle">All your previously calculated and saved bills</p>
      </div>

      {/* Summary bar */}
      {bills.length > 0 && (
        <div className="grid-3" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(99,102,241,0.15)" }}>📊</div>
            <div className="stat-body">
              <div className="stat-value">{bills.length}</div>
              <div className="stat-label">Total Bills</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(16,185,129,0.15)" }}>💰</div>
            <div className="stat-body">
              <div className="stat-value">₹{totalSpend.toFixed(0)}</div>
              <div className="stat-label">Total Spend</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(245,158,11,0.15)" }}>⚡</div>
            <div className="stat-body">
              <div className="stat-value">₹{bills.length ? (totalSpend / bills.length).toFixed(0) : 0}</div>
              <div className="stat-label">Average Bill</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginBottom: "1.25rem", padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            <Filter size={14} /> Filters:
          </div>
          <div className="select-wrap" style={{ minWidth: 160 }}>
            <select className="form-select" style={{ padding: "0.5rem 2rem 0.5rem 0.75rem", fontSize: "0.85rem" }} value={filterState} onChange={(e) => setFilterState(e.target.value)}>
              <option value="">All States</option>
              {["Maharashtra","Delhi","Karnataka","Gujarat","Uttar Pradesh"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="select-wrap" style={{ minWidth: 160 }}>
            <select className="form-select" style={{ padding: "0.5rem 2rem 0.5rem 0.75rem", fontSize: "0.85rem" }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              <option value="domestic">Domestic</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => fetchBills({ state: filterState || undefined, connectionType: filterType || undefined })}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <div className="spinner" style={{ margin: "0 auto", borderColor: "var(--border)", borderTopColor: "var(--accent-1)", width: 28, height: 28, borderWidth: 3 }} />
            <p style={{ color: "var(--text-muted)", marginTop: "1rem", fontSize: "0.9rem" }}>Loading bills...</p>
          </div>
        ) : bills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-title">No bills found</p>
            <p className="empty-desc">Calculate a bill from the Calculator page to see it here.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>State</th>
                  <th>Type</th>
                  <th>Units (kWh)</th>
                  <th>Energy Charge</th>
                  <th>Tax</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{bill.month}</td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={12} style={{ color: "var(--text-muted)" }} />
                        {bill.state}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${TYPE_BADGE[bill.connectionType] || "badge-domestic"}`} style={{ textTransform: "capitalize" }}>
                        {bill.connectionType}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Zap size={12} style={{ color: "var(--accent-2)" }} />
                        {bill.units}
                      </span>
                    </td>
                    <td>₹{bill.charges?.energy?.toFixed(2)}</td>
                    <td>₹{bill.charges?.tax?.toFixed(2)}</td>
                    <td style={{ color: "var(--accent-green)", fontWeight: 700, fontSize: "1rem" }}>
                      ₹{bill.totalAmount?.toFixed(2)}
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      {new Date(bill.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() => handleDelete(bill._id)}
                        disabled={deletingId === bill._id}
                        title="Delete"
                      >
                        {deletingId === bill._id ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> : <Trash2 size={13} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
