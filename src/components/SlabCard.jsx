import { Zap } from "lucide-react";

const RATE_MAX = 20;

export default function SlabCard({ slabs, activeUnits = 0 }) {
  if (!slabs || slabs.length === 0) return null;

  let consumed = activeUnits;
  const highlightIndex = slabs.findIndex((s) => {
    const max = s.max === Infinity || s.max === "∞" ? Infinity : s.max;
    if (consumed > 0 && consumed >= s.min) return true;
    return false;
  });

  // Determine which slab the units fall into
  let remaining = activeUnits;
  let activeSlab = -1;
  for (let i = 0; i < slabs.length; i++) {
    const max = slabs[i].max === Infinity || slabs[i].max === "∞" ? Infinity : Number(slabs[i].max);
    const min = slabs[i].min;
    if (remaining > 0) {
      activeSlab = i;
      remaining -= max === Infinity ? remaining : max - min + 1;
    }
  }

  return (
    <div className="slab-grid">
      {slabs.map((slab, i) => {
        const isActive = i === activeSlab;
        const barWidth = Math.min((slab.rate / RATE_MAX) * 100, 100);
        const maxLabel = slab.max === Infinity || slab.max === "∞" ? "∞" : slab.max;
        return (
          <div key={i} className={`slab-row${isActive ? " active-slab" : ""}`} style={{ animationDelay: `${i * 0.05}s` }}>
            <span className="slab-range" style={{ minWidth: 90 }}>
              {slab.min} – {maxLabel} kWh
            </span>
            <div className="slab-bar-wrap">
              <div className="slab-bar" style={{ width: `${barWidth}%` }} />
            </div>
            <span className="slab-rate" style={{ minWidth: 75, textAlign: "right" }}>
              <Zap size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />
              ₹{slab.rate}/kWh
            </span>
          </div>
        );
      })}
    </div>
  );
}
