import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Package, User, Tag, DollarSign, Calendar, Eye, Edit, Trash2, Loader2, Info, AlignLeft } from "lucide-react";
import { Api, handleApiError } from "../../../components/common/Api/api";
import { useToast } from "../../../components/common/Toast";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import ConfirmModal from "../../../components/common/ConfirmModal";

const ProductShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const res = await Api.get(`/products/${id}`);
            setProduct(res.data.data);
        } catch (err) {
            handleApiError(err, null, addToast);
            navigate("/admin/products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await Api.delete(`/products/${id}`);
            addToast("Asset removed from registry", "success");
            navigate("/admin/products");
        } catch (err) {
            handleApiError(err, null, addToast);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="text-indigo-500 animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className="p-10 space-y-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate("/admin/products")} 
                        className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 text-slate-500 hover:text-indigo-500 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Asset <span className="text-indigo-600">Intelligence</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Registry Details</p>
                    </div>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    <Link to={`/admin/products/edit/${id}`} className="flex-1">
                        <Button variant="secondary" icon={Edit} className="w-full rounded-2xl">Modify</Button>
                    </Link>
                    <Button 
                        variant="primary" 
                        icon={Trash2} 
                        className="flex-1 rounded-2xl bg-red-600 hover:bg-red-500 border-none shadow-lg shadow-red-500/20"
                        onClick={() => setIsConfirmOpen(true)}
                    >
                        Decommission
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Identity Card */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-10 border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-premium rounded-[3rem]">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                                <Package size={40} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">{product.name}</h2>
                                <p className="text-indigo-500 font-bold uppercase tracking-widest text-xs mt-1">{product.category}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                                    <AlignLeft size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Specifications</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                        {product.description || "No detailed specifications provided for this asset."}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Market Valuation</p>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                            <DollarSign size={16} />
                                        </div>
                                        <span className="text-2xl font-black dark:text-white text-slate-900">{product.price}</span>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Registry Lifecycle</p>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                            <Calendar size={16} />
                                        </div>
                                        <span className="text-base font-bold dark:text-white text-slate-900">
                                            {new Date(product.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <Card className="p-8 border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-premium rounded-[3rem]">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">Ownership Identity</h3>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{product.User?.username}</p>
                                <p className="text-[10px] text-slate-500 font-bold">{product.User?.email}</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Security Credentials</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Authenticated Asset Record
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-slate-200 dark:border-white/5 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/20 rounded-[3rem]">
                        <Info className="mb-4 opacity-50" size={32} />
                        <h3 className="text-xl font-black mb-2 tracking-tight">Immutable Record</h3>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">
                            This asset is protected by NexusCore security protocols. 
                            All modifications are permanently logged for audit trails.
                        </p>
                    </Card>
                </div>
            </div>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Confirm Decommission?"
                message={`Are you sure you want to permanently remove ${product.name}? This action cannot be reversed.`}
            />
        </div>
    );
};

export default ProductShow;
