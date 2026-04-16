import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Package, Search, Tag, DollarSign, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Api, handleApiError } from "../../../components/common/Api/api";
import { useToast } from "../../../components/common/Toast";
import { useAuth } from "../../../context/AuthContext";
import Table from "../../../components/common/Table";
import Button from "../../../components/common/Button";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Card from "../../../components/common/Card";

const ProductIndex = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [search, setSearch] = useState("");
  
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await Api.get("/products");
      setProducts(res.data.data);
    } catch (err) {
      handleApiError(err, null, addToast);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    setLoading(true);
    try {
      await Api.delete(`/products/${currentProduct.id}`);
      addToast("Product removed successfully", "success");
      setIsConfirmOpen(false);
      fetchProducts();
    } catch (err) {
      handleApiError(err, null, addToast);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    if (search === "owner:me") {
        return p.userId === user.id;
    }
    return p.name.toLowerCase().includes(search.toLowerCase()) || 
           p.category.toLowerCase().includes(search.toLowerCase()) ||
           p.User?.username.toLowerCase().includes(search.toLowerCase());
  });

  const columns = [
    { header: "Product Details", accessor: "name", render: (val, _, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold border border-indigo-500/20 shadow-sm">
          {val[0]?.toUpperCase()}
        </div>
        <div className="flex flex-col">
          <Link to={`/admin/products/show/${row.id}`} className="font-bold text-slate-900 dark:text-white uppercase tracking-tight hover:text-indigo-500 transition-colors">
            {val}
          </Link>
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Serial: {row.id.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>
    )},
    { header: "Market Stats", accessor: "price", render: (val, _, row) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <DollarSign size={12} className="text-emerald-500" />
          {val}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Tag size={10} className="text-indigo-400" />
          {row.category}
        </div>
      </div>
    )},
    { header: "Identity", accessor: "User", render: (val) => (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 w-fit">
        <User size={12} className="text-indigo-400" />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{val?.username || 'System'}</span>
      </div>
    )},
    { header: "Control", accessor: "id", render: (_, __, row) => (
      <div className="flex items-center gap-2">
        <Link to={`/admin/products/show/${row.id}`} title="View Details">
            <button className="p-2.5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-400 hover:text-indigo-500 rounded-xl transition-all border border-transparent">
                <Eye size={16} />
            </button>
        </Link>
        <Link to={`/admin/products/edit/${row.id}`} title="Modify Record">
            <button className="p-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-500 rounded-xl transition-all border border-transparent hover:border-indigo-500/20">
                <Edit size={16} />
            </button>
        </Link>
        <button 
          onClick={() => { setCurrentProduct(row); setIsConfirmOpen(true); }}
          className="p-2.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/20"
          title="Delete Asset"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="p-10 space-y-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-premium mt-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Manage <span className="text-indigo-600">Inventory</span>
          </h1>
          <p className="text-slate-500 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">{user?.role === 'admin' ? 'Universal Operations' : 'Personal Inventory Control'}</p>
        </div>
        <Link to="/admin/products/create">
          <Button variant="primary" size="lg" icon={Plus}>
            Add Product
          </Button>
        </Link>
      </div>

      <Card className="p-8 border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-premium overflow-hidden rounded-[2.5rem]">
        {/* Filter Tabs for Admin */}
        {user?.role === 'admin' && (
          <div className="flex gap-2 mb-8 bg-slate-50 dark:bg-white/5 p-1.5 rounded-2xl w-fit border border-slate-100 dark:border-white/5">
            <button 
              onClick={() => {
                setSearch("");
                setSearch(""); // Resetting search to show all if needed
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                !search.includes("owner:me") 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Universal View
            </button>
            <button 
                onClick={() => setSearch("owner:me")}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    search.includes("owner:me") 
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              My Personal Items
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8 max-w-lg relative group">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Query by asset name, category or owner..." 
              value={search === "owner:me" ? "" : search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-indigo-500/50 rounded-[1.5rem] outline-none transition-all dark:text-white font-medium"
            />
          </div>
        </div>

        <Table columns={columns} data={filteredProducts} loading={loading} />
      </Card>

      {/* Confirmation */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Delete This Asset?"
        message={`Warning: You are about to permanently remove ${currentProduct?.name} from NexusCore.`}
        isLoading={loading}
      />
    </div>
  );
};

export default ProductIndex;
