import React, { useState } from "react";
import {
  Menu,
  ChevronLeft,
  LayoutDashboard,
  Users,
  Package,
  Layers,
  Settings,
  HelpCircle,
  UserPlus,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Asidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin/dashboard" && location.pathname === "/admin/dashboard") return true;
    if (path !== "/admin/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "User Directory", path: "/admin/users", icon: Users, roles: ['admin'] },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  // Filter menu items by role
  const filteredMenu = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div
      className={`h-screen relative transition-all duration-500 ease-in-out print:hidden ${
        isOpen ? "w-72" : "w-24"
      } bg-slate-950 text-slate-300 border-r border-white/5 z-50`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-4 px-6 py-8 mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
          <Package className="text-white" size={24} />
        </div>
        <div className={`transition-all duration-300 ${!isOpen && "opacity-0 invisible translate-x-2"}`}>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Nexus<span className="text-indigo-500">Core</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">v2.0.4</p>
        </div>
      </div>

      {/* Menu Sections */}
      <nav className="px-4 space-y-8">
        <div>
          <p className={`px-4 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-opacity ${!isOpen && "opacity-0"}`}>
            Main Menu
          </p>
          <ul className="space-y-1.5">
            {filteredMenu.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
                      active
                        ? "bg-indigo-600/10 text-white"
                        : "hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {active && (
                        <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                    )}
                    <item.icon 
                        className={`shrink-0 transition-all duration-300 ${active ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" : "text-slate-500 group-hover:text-slate-300"}`} 
                        size={isOpen ? 22 : 26} 
                    />
                    <span className={`font-semibold text-sm transition-all duration-300 ${!isOpen && "opacity-0 translate-x-4 pointer-events-none"}`}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Utilities */}
      <div className="absolute bottom-8 left-4 right-4">
        {isOpen ? (
            <div className="p-4 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <HelpCircle size={16} className="text-indigo-400" />
                    </div>
                    <span className="text-xs font-bold text-white">Support</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-4">Need help? Documentation and guides available.</p>
                <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-xl transition-colors">
                    VIEW DOCS
                </button>
            </div>
        ) : (
            <div className="flex justify-center">
                <button className="p-3 bg-white/5 rounded-2xl hover:bg-indigo-600/20 text-indigo-400 transition-all">
                    <HelpCircle size={24} />
                </button>
            </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-24 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center border-4 border-slate-950 hover:bg-indigo-500 transition-colors z-50 transform hover:scale-110"
      >
        <ChevronLeft size={14} className={`transition-transform duration-500 ${!isOpen && "rotate-180"}`} />
      </button>
    </div>
  );
};

export default Asidebar;