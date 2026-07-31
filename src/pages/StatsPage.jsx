import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Zap, DollarSign, Activity } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";
import { getBillStats } from "../services/api";
import toast from "react-hot-toast";

const TYPE_COLORS = { domestic: "#6366f1", commercial: "#f59e0b", industrial: "#06b6d4" };
const PIE_COLORS = ["#6366f1", "#f59e0b", "#06b6d4", "#10b981", "#ef4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.85rem" }}>
      <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>₹{Number(p.value).toFixed(2)}</p>
      ))}
    </div>
  );
};

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBillStats()
      .then((res) => setStats(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto", width: 36, height: 36, borderWidth: 3, borderColor: "var(--border)", borderTopColor: "var(--accent-1)" }} />
          <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats || stats.overview?.totalBills === 0) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">📊 Statistics</h1>
          <p className="page-subtitle">Visual insights from your bill history</p>
        </div>
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p className="empty-title">No data yet</p>
            <p className="empty-desc">Calculate and save some bills to see your statistics here.</p>
          </div>
        </div>
      </div>
    );
  }

  const { overview, byType, byState, recent } = stats;

  // Recent bills for line chart
  const recentChartData = [...(recent || [])].reverse().map((b, i) => ({
    name: `#${i + 1}`,
    amount: b.totalAmount,
    units: b.units,
    type: b.connectionType,
  }));

  // By type pie data
  const pieData = byType.map((t) => ({
    name: t._id.charAt(0).toUpperCase() + t._id.slice(1),
    value: parseFloat(t.totalSpend.toFixed(2)),
    count: t.count,
    color: TYPE_COLORS[t._id] || "#6366f1",
  }));

  // By state bar data
  const stateData = byState.map((s) => ({ name: s._id, spend: parseFloat(s.totalSpend.toFixed(2)), count: s.count }));

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">📊 Statistics</h1>
        <p className="page-subtitle">Visual insights from your {overview.totalBills} saved bills</p>
      </div>

      {/* Overview stat cards */}
      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        {[
          { label: "Total Bills", value: overview.totalBills, icon: "📋", color: "rgba(99,102,241,0.15)", prefix: "" },
          { label: "Total Spend", value: `₹${Number(overview.totalSpend).toFixed(0)}`, icon: "💰", color: "rgba(16,185,129,0.15)", prefix: "" },
          { label: "Average Bill", value: `₹${Number(overview.avgBill).toFixed(0)}`, icon: "📈", color: "rgba(245,158,11,0.15)", prefix: "" },
          { label: "Total Units", value: `${Number(overview.totalUnits).toFixed(0)} kWh`, icon: "⚡", color: "rgba(6,182,212,0.15)", prefix: "" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.color, fontSize: "1.3rem" }}>{s.icon}</div>
            <div className="stat-body">
              <div className="stat-value" style={{ fontSize: "1.3rem" }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>

        {/* Spend by Type — Pie Chart */}
        <div className="card">
          <p className="section-title" style={{ marginBottom: "1rem" }}><Activity size={13} /> Spend by Connection Type</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `₹${val}`} contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: "0.8rem", color: "var(--text-secondary)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Spend by State — Bar Chart */}
        <div className="card">
          <p className="section-title" style={{ marginBottom: "1rem" }}><BarChart3 size={13} /> Spend by State</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stateData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="spend" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bills trend */}
      {recentChartData.length > 1 && (
        <div className="card" style={{ marginBottom: "1.25rem" }}>
          <p className="section-title" style={{ marginBottom: "1rem" }}><TrendingUp size={13} /> Bill Amount Trend (Recent {recentChartData.length} Bills)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={recentChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="amount" stroke="#818cf8" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 7, fill: "#a78bfa" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Extremes */}
      <div className="grid-2">
        <div className="card" style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
          <p className="section-title" style={{ color: "var(--accent-green)", marginBottom: "0.5rem" }}>🟢 Lowest Bill</p>
          <p style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", color: "var(--accent-green)" }}>
            ₹{Number(overview.minBill).toFixed(2)}
          </p>
        </div>
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)" }}>
          <p className="section-title" style={{ color: "var(--accent-red)", marginBottom: "0.5rem" }}>🔴 Highest Bill</p>
          <p style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", color: "var(--accent-red)" }}>
            ₹{Number(overview.maxBill).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
