import React from "react";
import { Bell, LogOut, Search, Settings } from "lucide-react";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-40 w-full px-6 py-4 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
            
            {/* Search Section */}
            <div className="flex-1 max-w-xl group relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-2xl outline-none transition-all dark:text-white placeholder:text-slate-500 font-medium"
                />
            </div>

            {/* Right Actions Section */}
            <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/5">
                    <button className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all">
                        <Bell size={20} />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all">
                        <Settings size={20} />
                    </button>
                    <ThemeToggle />
                </div>

                <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-2" />

                {/* User Island */}
                <div className="flex items-center gap-4 bg-indigo-600/5 dark:bg-indigo-500/10 pl-4 pr-1 py-1 rounded-full border border-indigo-500/20 group hover:border-indigo-500/40 transition-all">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {user?.username || "Guest"}
                        </span>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">
                            Verified User
                        </span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-500 font-bold text-sm">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                    </div>

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={logout}
                        className="text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full"
                        icon={LogOut}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;