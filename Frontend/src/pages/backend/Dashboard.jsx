import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Users, 
    Package, 
    ShoppingCart, 
    ArrowUpRight, 
    TrendingUp, 
    Activity, 
    Plus, 
    Download,
    Calendar,
    ChevronRight,
    UserPlus,
    LayoutDashboard,
    Database,
    Settings,
    Shield,
    Gem,
    Zap
} from 'lucide-react';
import { Api, handleApiError } from '../../components/common/Api/api';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Dashboard = () => {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState({ products: 0, items: 156, revenue: '1.2M' });
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await Api.get('/products/stats');
            const data = res?.data?.data;
            setStatsData(prev => ({ 
                ...prev, 
                products: data?.totalProducts || 0,
                myProducts: data?.userProducts || 0,
                isAdmin: data?.isAdmin
            }));
        } catch (err) {
            console.error("Dashboard data fetch failed:", err);
            if (err.response?.status !== 401) {
                handleApiError(err, null, addToast);
            }
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { 
            label: 'Universal Assets', 
            value: statsData?.products || 0, 
            change: '+14%', 
            icon: Package, 
            color: 'from-indigo-600 to-indigo-800', 
            isHero: true,
            action: {
                icon: Plus,
                path: '/admin/products/create',
                tooltip: 'Add New'
            }
        },
        { label: 'My Personal Assets', value: statsData?.myProducts || 0, change: '+5%', icon: Shield, color: 'from-slate-800 to-slate-900', isHero: false, show: user?.role === 'admin' },
        { label: 'Revenue Est.', value: `₹${statsData?.revenue || '0'}`, change: '+18%', icon: ShoppingCart, color: 'from-slate-800 to-slate-900', isHero: false },
    ].filter(s => s.show !== false);

    const quickActions = [
        { name: 'Register Asset', icon: Package, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10', path: '/admin/products/create' },
        { name: 'Inventory View', icon: Database, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', path: '/admin/products' },
        { name: 'Settings Hub', icon: Settings, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10', path: '/admin/settings' },
    ];

    const filteredActions = quickActions.filter(action => 
        !action.roles || action.roles.includes(user?.role)
    );

    return (
        <div className="p-8 space-y-10 min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Premium Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-premium overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                    <Gem size={120} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <Zap size={18} />
                        </div>
                        <span className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.3em]">Operational Core</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                        System <span className="text-indigo-600 dark:text-indigo-400">Hub</span>
                    </h1>
                </div>
                
                <div className="flex gap-4 relative z-10">
                    {user?.role === 'admin' ? (
                        <>
                            <Link to="/admin/products">
                                <Button variant="secondary" size="lg" className="px-8 rounded-2xl border-slate-200 dark:border-white/10 font-bold">
                                    Browse Inventory
                                </Button>
                            </Link>
                            <Link to="/admin/products/create">
                                <Button variant="primary" size="lg" icon={Package} className="px-8 rounded-2xl shadow-xl shadow-indigo-500/20 font-bold">
                                    Add New Asset
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Button variant="outline" size="lg" className="px-8 rounded-2xl font-bold">
                            Request Access
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Section with Hero Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((item, index) => (
                    <Card 
                        key={index} 
                        className={`p-1 group relative overflow-hidden transition-all duration-700 border-none rounded-[3rem] ${
                            item.isHero ? 'md:scale-105 shadow-2xl shadow-indigo-500/20' : 'hover:-translate-y-2'
                        }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                        <div className={`relative m-[1px] rounded-[2.9rem] p-10 transition-all duration-500 ${
                            item.isHero ? 'bg-gradient-to-br from-indigo-600 to-indigo-500' : 'bg-white dark:bg-slate-900 shadow-premium'
                        }`}>
                            <div className="flex justify-between items-start mb-10">
                                <div className={`p-5 rounded-2xl shadow-xl transition-all duration-500 ${
                                    item.isHero ? 'bg-white/20 text-white' : `bg-gradient-to-br ${item.color} text-white`
                                }`}>
                                    <item.icon size={32} />
                                </div>
                                <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black tracking-widest ${
                                    item.isHero ? 'bg-white/10 text-white' : 'bg-emerald-500/10 text-emerald-500'
                                }`}>
                                    <TrendingUp size={14} />
                                    {item.change}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between gap-4 mb-3">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.25em] ${
                                    item.isHero ? 'text-white/70' : 'text-slate-400'
                                }`}>
                                    {item.label}
                                </h3>
                                
                                {item.action && user?.role === 'admin' && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(item.action.path);
                                        }}
                                        className={`p-1.5 rounded-lg transition-all duration-300 ${
                                            item.isHero 
                                                ? 'bg-white/10 hover:bg-white/20 text-white' 
                                                : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-lg shadow-indigo-500/10'
                                        }`}
                                        title={item.action.tooltip}
                                    >
                                        <item.action.icon size={16} />
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className={`text-5xl font-black tracking-tighter ${
                                    item.isHero ? 'text-white' : 'text-slate-900 dark:text-white'
                                }`}>
                                    {loading ? '...' : item.value}
                                </span>
                                <ArrowUpRight className={`transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 ${
                                    item.isHero ? 'text-white/30' : 'text-slate-300'
                                }`} size={32} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Action Banner */}
            {user?.role === 'admin' && (
                <div className="relative rounded-[3.5rem] bg-indigo-600 p-12 overflow-hidden shadow-2xl shadow-indigo-500/30 group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/50 to-transparent" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black text-white mb-3">Scale Your Inventory</h2>
                            <p className="text-indigo-100 max-w-xl text-lg font-medium opacity-80">
                                Our Inventory module is optimized for rapid asset entry. 
                                Execute a new product registration in less than 30 seconds.
                            </p>
                        </div>
                        <Link to="/admin/products/create">
                            <button className="px-10 py-5 bg-white text-indigo-600 rounded-3xl font-black text-lg hover:bg-slate-50 hover:scale-105 transition-all shadow-xl flex items-center gap-3">
                                <Package size={24} />
                                Start Inventory Entry
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* System Logs */}
                <Card className="p-10 border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-premium rounded-[3rem]">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100 dark:border-white/5">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight italic">Operations Log</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Real-time Node Status</p>
                        </div>
                        <Button variant="ghost" size="sm" icon={ChevronRight} iconPosition="right" className="text-indigo-500 font-bold">Audit Trails</Button>
                    </div>
                    
                    <div className="space-y-6">
                        {[
                            { title: 'NexusCore Sync', desc: 'Product inventory refreshed', time: 'Just now', icon: Activity },
                            { title: 'Security Protocol', desc: 'Auth credentials verified', time: '14m ago', icon: Shield },
                            { title: 'Data Backup', desc: 'Auto-snapshot completed', time: '2h ago', icon: Database },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center gap-6 p-5 rounded-3xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                    <log.icon size={28} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-bold text-slate-900 dark:text-white transition-colors uppercase tracking-tight">{log.title}</p>
                                    <p className="text-sm text-slate-500 font-medium">{log.desc}</p>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Access Grid */}
                <div className="grid grid-cols-1 gap-8">
                    <Card className="p-10 border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-premium rounded-[3rem] h-full">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-10 tracking-tight">Rapid Access</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredActions.map((action, index) => (
                                <button 
                                    key={index}
                                    onClick={() => action.path !== '#' && navigate(action.path)}
                                    className="flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-transparent hover:border-indigo-500/20 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 group text-center"
                                >
                                    <div className={`p-4 rounded-2xl ${action.color} group-hover:scale-110 transition-transform duration-500`}>
                                        <action.icon size={32} />
                                    </div>
                                    <span className="font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300 group-hover:text-indigo-500">{action.name}</span>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;