import { NavLink, Outlet } from "react-router-dom";
import "../styles/layout.css";

const navItems = [
  { to: "/", label: "Головна", icon: "⌂", end: true },
  { to: "/herd", label: "Поголів'я", icon: "◈" },
  { to: "/breeds", label: "Породи", icon: "◉" },
  { to: "/calculator", label: "Калькулятор корму", icon: "⊞" },
  { to: "/farrowings", label: "Опороси", icon: "◎" },
  { to: "/vaccinations", label: "Вакцинація", icon: "✦" },
  { to: "/diseases", label: "Хвороби", icon: "⊕" },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🐖</span>
          <div className="brand-text">
            <span className="brand-title">П’ятачок</span>
            <span className="brand-sub">Управління фермою</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span>v1.0 · localStorage</span>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
