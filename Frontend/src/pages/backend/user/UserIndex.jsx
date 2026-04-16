import React, { useState, useEffect } from "react";
import { Users, Search, Mail, Shield, ShieldCheck, Activity } from "lucide-react";
import { Api, handleApiError } from "../../../components/common/Api/api";
import { useToast } from "../../../components/common/Toast";
import Table from "../../../components/common/Table";
import Card from "../../../components/common/Card";

const UserIndex = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await Api.get("/auth/users");
      setUsers(res.data.data);
    } catch (err) {
      handleApiError(err, null, addToast);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Account Identity", accessor: "username", render: (val, _, row) => (
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border shadow-sm ${
          row.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
        }`}>
          {val[0]?.toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{val}</span>
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">UID: {row.id.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>
    )},
    { header: "Communication", accessor: "email", render: (val) => (
      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
        <Mail size={12} className="text-indigo-400" />
        {val}
      </div>
    )},
    { header: "Security Role", accessor: "role", render: (val) => (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit ${
        val === 'admin' 
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
      }`}>
        {val === 'admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
        <span className="text-xs font-bold uppercase tracking-widest">{val}</span>
      </div>
    )},
    { header: "Status", accessor: "createdAt", render: (val) => (
      <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
        <Activity size={12} />
        Active
      </div>
    )},
  ];

  return (
    <div className="p-10 space-y-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-premium mt-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            User <span className="text-indigo-600">Directory</span>
          </h1>
          <p className="text-slate-500 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Universal Participant List</p>
        </div>
      </div>

      <Card className="p-8 border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-premium overflow-hidden rounded-[2.5rem]">
        {/* Search Bar */}
        <div className="mb-8 max-w-lg relative group">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Query by username or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus:border-indigo-500/50 rounded-[1.5rem] outline-none transition-all dark:text-white font-medium"
            />
          </div>
        </div>

        <Table columns={columns} data={filteredUsers} loading={loading} />
      </Card>
    </div>
  );
};

export default UserIndex;
