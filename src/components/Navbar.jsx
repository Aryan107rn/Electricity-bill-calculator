import { NavLink, Link } from "react-router-dom";
import { Zap, LayoutDashboard, History, BarChart3, Sun, Moon, Menu, X } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useState } from "react";

export default function Navbar() {
  const { isDark, toggle } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Calculator", icon: LayoutDashboard },
    { to: "/history", label: "History", icon: History },
    { to: "/stats", label: "Statistics", icon: BarChart3 },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Zap size={18} color="white" fill="white" />
          </div>
          <span className="navbar-logo-text">ElectraBill</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar-nav" style={{ display: "flex" }}>
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                <Icon size={15} style={{ marginRight: 4, verticalAlign: "middle" }} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="icon-btn" onClick={toggle} title="Toggle theme">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="icon-btn"
            style={{ display: "none" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ padding: "0.75rem 1.5rem 1rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={() => setMobileOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
