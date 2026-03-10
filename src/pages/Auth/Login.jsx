import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Info, GraduationCap } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.auth.login({ email, password });
            login(response.user, response.token);

            toast.success("Login successful!", {
                toastId: 'login-success',
                autoClose: 1500,
                icon: false,
                onClose: () => {
                    if (response.user.role === 'Admin') navigate('/admin');
                    else if (response.user.role === 'Manager') navigate('/manager');
                    else navigate('/sales');
                }
            });
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden bg-white">
            {/* Left Side: Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#1e293b]">
                <img
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070"
                    alt="Institutional workspace"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-[#1e293b]/50"></div>

                <div className="relative z-10 p-10 flex flex-col justify-between h-full bg-slate-900/40 backdrop-blur-[2px] w-full">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-[#3c72d1] p-1.5 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter uppercase">Learnix<span className="text-[#3c72d1]">CRM</span></span>
                    </Link>

                    <div>
                        <h1 className="text-4xl font-black text-white leading-tight mb-3 tracking-tight">
                            Streamline your <br />
                            <span className="text-[#3c72d1]">Academic Excellence.</span>
                        </h1>
                        <p className="text-gray-300 text-base font-medium leading-relaxed max-w-sm">
                            The professional institutional CRM to manage teams, track performance, and accelerate growth.
                        </p>
                    </div>

                    <div className="pb-4">
                        <p className="text-xs text-gray-400 font-bold tracking-wide uppercase">Join 2,000+ top institutions</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50">
                <div className="w-full max-w-[380px] space-y-6">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-4">
                            <GraduationCap className="text-[#3c72d1]" size={24} />
                            <span className="text-lg font-black text-slate-800 tracking-tighter uppercase">Learnix<span className="text-[#3c72d1]">CRM</span></span>
                        </Link>
                        <h2 className="text-slate-900 text-2xl font-black tracking-tight">Welcome Back</h2>
                        <p className="text-slate-500 mt-1 text-xs font-medium">Please enter your credentials</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@institution.com"
                                required
                                className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 placeholder:text-slate-400 transition-all shadow-sm text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                                <a href="#" className="text-[9px] font-bold text-[#3c72d1] hover:underline uppercase tracking-wider">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 placeholder:text-slate-400 transition-all shadow-sm text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[#3c72d1] hover:bg-[#2d5dbd] text-white p-3.5 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all disabled:opacity-50 text-sm">
                            <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                        {error && <p className="text-red-500 mt-2 text-center text-[10px] font-bold bg-red-50 py-1.5 rounded-lg border border-red-100">{error}</p>}
                    </form>

                    <div className="pt-2 text-center text-slate-500 text-xs">
                        Don't have an account? <Link to="/register" className="text-[#3c72d1] font-bold hover:underline">Request access</Link>
                    </div>

                    <div className="mt-4 p-3.5 bg-white border border-slate-100 rounded-xl flex gap-3 items-center shadow-sm">
                        <div className="p-1.5 bg-blue-50 text-[#3c72d1] rounded-lg">
                            <Info size={14} />
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                            Administrative access is strictly for authorized personnel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

