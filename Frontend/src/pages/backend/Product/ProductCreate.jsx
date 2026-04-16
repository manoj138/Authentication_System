import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Save, ArrowLeft, Tag, DollarSign, AlignLeft, Info } from "lucide-react";
import { Api, handleApiError } from "../../../components/common/Api/api";
import { useToast } from "../../../components/common/Toast";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Card from "../../../components/common/Card";

const ProductCreate = () => {
    const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "" });
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await Api.post("/products", formData);
            addToast("Asset registered successfully!", "success");
            navigate("/admin/products");
        } catch (err) {
            handleApiError(err, null, addToast);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mt-10">
                <button 
                    onClick={() => navigate("/admin/products")} 
                    className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 text-slate-500 hover:text-indigo-500 hover:border-indigo-500/20 transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Register <span className="text-indigo-600">New Asset</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Inventory Control</p>
                </div>
            </div>

            <div className="max-w-3xl">
                <Card className="p-10 border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-premium rounded-[2.5rem]">
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100 dark:border-white/5">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <Package size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Asset Details</h2>
                            <p className="text-slate-500 text-sm">Enter the technical and market specifics of the product.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input 
                                label="Asset Name" 
                                placeholder="e.g. Nexus Laptop X1" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                icon={Info}
                            />
                            <Input 
                                label="Asset Category" 
                                placeholder="e.g. Electronics, Furniture" 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                icon={Tag}
                                required
                            />
                        </div>

                        <Input 
                            label="Market Price (USD)" 
                            type="number"
                            step="0.01"
                            placeholder="0.00" 
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            icon={DollarSign}
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Description / Technical Specs</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <AlignLeft size={18} />
                                </div>
                                <textarea 
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-indigo-500/50 rounded-2xl outline-none transition-all dark:text-white font-medium min-h-[120px]"
                                    placeholder="Provide detailed description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <Button 
                                type="button" 
                                variant="secondary" 
                                size="lg"
                                className="px-10 rounded-2xl"
                                onClick={() => navigate("/admin/products")}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                size="lg"
                                className="px-10 rounded-2xl shadow-indigo-500/20 flex-1 md:flex-none"
                                loading={loading}
                                icon={Save}
                            >
                                Execute Registration
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ProductCreate;
