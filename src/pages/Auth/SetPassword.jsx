import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, CheckCircle2, GraduationCap, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';

const SetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Missing secure token. Please use the link provided in your email.');
        }
    }, [token]);

    const handleSetPassword = async (e) => {
        e.preventDefault();

        if (!token) {
            setError('Invalid or missing token. Please check your email link.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Sending token and password as expected by the backend
            await api.auth.setPassword({ token, password });
            setIsSuccess(true);
            toast.success("Password configured successfully!", {
                toastId: 'set-password-success',
                position: "top-center"
            });

            // Redirect after a short delay to let the user see the success state
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to establish your password. The link might be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden bg-white text-sm">
            {/* Left Side: Branding & Visuals (Matching Login/Register style) */}
            <div className="hidden lg:flex lg:w-5/12 relative bg-[#0f172a]">
                <img
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
                    alt="Security & Technology"
                    className="absolute inset-0 w-full h-full object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-slate-900/80 to-black/60"></div>

                <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
                    <Link to="/" className="flex items-center gap-2 group w-fit">
                        <motion.div
                            whileHover={{ rotate: 15 }}
                            className="bg-[#3c72d1] p-2 rounded-xl shadow-xl shadow-blue-500/20 transition-all"
                        >
                            <GraduationCap className="text-white" size={28} />
                        </motion.div>
                        <span className="text-2xl font-black text-white tracking-tighter uppercase">Learnix<span className="text-[#3c72d1]">CRM</span></span>
                    </Link>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
                                Secure Your <br />
                                <span className="text-[#3c72d1]">Digital Identity.</span>
                            </h2>
                            <p className="text-slate-400 text-lg font-medium mt-4 max-w-md leading-relaxed">
                                You're one step away from accessing the Learnix ecosystem. Set a strong password to protect your institutional data.
                            </p>
                        </motion.div>

                        <div className="space-y-4 pt-4">
                            {[
                                "End-to-end Encrypted Sessions",
                                "Multi-factor Security Layer",
                                "Role-based Access Control"
                            ].map((text, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="flex items-center gap-3 text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 backdrop-blur-sm"
                                >
                                    <ShieldCheck size={18} className="text-[#3c72d1]" />
                                    <span className="text-sm font-bold tracking-wide">{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8">
                        <p className="text-xs text-slate-500 font-bold tracking-[0.2em] uppercase">
                            Learnix Protocol v2.5
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Password Setup Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-6 bg-slate-50">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-[420px] space-y-8"
                        >
                            <div className="text-center lg:text-left">
                                <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
                                    <GraduationCap className="text-[#3c72d1]" size={28} />
                                    <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Learnix<span className="text-[#3c72d1]">CRM</span></span>
                                </Link>
                                <h2 className="text-slate-900 text-3xl font-black tracking-tight">Set Your Password</h2>
                                <p className="text-slate-500 mt-2 text-sm font-medium">
                                    {emailFromUrl ? `Setting credentials for ${emailFromUrl}` : 'Create a secure password for your new account'}
                                </p>
                            </div>

                            <form onSubmit={handleSetPassword} className="space-y-5">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
                                    >
                                        <AlertCircle className="text-red-500 mt-0.5" size={18} />
                                        <p className="text-red-600 text-xs font-bold leading-normal">{error}</p>
                                    </motion.div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#3c72d1] transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            required
                                            disabled={!token || loading}
                                            className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3c72d1]/10 focus:border-[#3c72d1] transition-all shadow-sm text-sm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Identity</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#3c72d1] transition-colors">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Repeat password"
                                            required
                                            disabled={!token || loading}
                                            className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3c72d1]/10 focus:border-[#3c72d1] transition-all shadow-sm text-sm"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !token}
                                    className="w-full bg-[#3c72d1] hover:bg-[#2d5dbd] text-white py-4 mt-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            Initialize Account <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="p-5 bg-white border border-slate-200 rounded-3xl flex gap-4 items-center shadow-sm">
                                <div className="p-3 bg-blue-50 text-[#3c72d1] rounded-2xl">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] text-slate-900 font-black uppercase tracking-tight">Security Tip</p>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                                        Use a unique combination of symbols and numbers for maximum protection.
                                    </p>
                                </div>
                            </div>

                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Need help? <a href="mailto:support@learnix.com" className="text-[#3c72d1] hover:underline">Contact Registry</a>
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-[400px] text-center"
                        >
                            <div className="inline-flex p-6 bg-green-50 text-green-500 rounded-[40px] mb-8 shadow-inner">
                                <CheckCircle2 size={80} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Account Initialized</h2>
                            <p className="text-slate-500 mb-8 font-medium">Your password has been successfully configured. We are redirecting you to the portal.</p>

                            <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ duration: 3, ease: "linear" }}
                                    className="w-full h-full bg-green-500"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SetPassword;
