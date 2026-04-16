import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Package } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        const success = await register(formData.username, formData.email, formData.password);
        if (success) {
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 px-4 py-12">
            {/* Background Decorations */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />

            <div className="w-full max-w-md relative z-10">
                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)] transform rotate-6 mb-5">
                        <Package className="text-white" size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Nexus<span className="text-violet-500">Core</span>
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[9px] mt-1.5">New Account Registration</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Initialize Account</h1>
                        <p className="text-slate-400 text-sm">Join the administrative network today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Operator Identity"
                            name="username"
                            placeholder="Full Name"
                            value={formData.username}
                            onChange={handleChange}
                            icon={User}
                            className="dark"
                            required
                        />

                        <Input
                            label="Communication Email"
                            name="email"
                            type="email"
                            placeholder="operator@nexuscore.com"
                            value={formData.email}
                            onChange={handleChange}
                            icon={Mail}
                            className="dark"
                            required
                        />

                        <Input
                            label="Security Key"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            icon={Lock}
                            className="dark"
                            required
                        />

                        <Input
                            label="Confirm Key"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            icon={Lock}
                            className="dark"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full py-4 mt-4 bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                            size="lg"
                            loading={loading}
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            CREATE PROFILE
                        </Button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Already registered?{' '}
                        <Link
                            to="/"
                            className="text-violet-500 font-bold hover:underline underline-offset-4"
                        >
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
