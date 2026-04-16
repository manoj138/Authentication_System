import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Package } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
        if (success) {
            navigate('/admin/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 px-4 py-12">
            {/* Background Decorations */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] animate-pulse" />

            <div className="w-full max-w-md relative z-10">
                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] transform -rotate-6 mb-6">
                        <Package className="text-white" size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">
                        Nexus<span className="text-indigo-500">Core</span>
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Administrative Access</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="mb-10">
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400 text-sm">Enter your credentials to continue to the dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="mail@nexuscore.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            className="dark"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            className="dark"
                            required
                        />

                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition-colors">
                                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="text-indigo-500 hover:text-indigo-400">
                                Reset Password
                            </a>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                            size="lg"
                            loading={loading}
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            AUTHENTICATE
                        </Button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Need access?{' '}
                        <Link
                            to="/register"
                            className="text-indigo-500 font-bold hover:underline underline-offset-4"
                        >
                            Request an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
