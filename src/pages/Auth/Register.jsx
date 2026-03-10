import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, GraduationCap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        role: 'Sales'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation
        const nameRegex = /^[A-Za-z]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!nameRegex.test(formData.firstName)) {
            setError('First name must contain only letters');
            return;
        }
        if (!nameRegex.test(formData.lastName)) {
            setError('Last name must contain only letters');
            return;
        }
        if (!phoneRegex.test(formData.contactNumber)) {
            setError('Contact number must be exactly 10 digits');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.auth.register(formData);
            toast.success(`Registration successful! Please wait for admin approval.`, { toastId: 'register-success' });
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden bg-white text-sm">
            {/* Left Side: Branding & Info */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f172a]">
                <img
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2074"
                    alt="Collaboration"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-transparent to-black/60"></div>

                <div className="relative z-10 p-10 flex flex-col justify-between h-full w-full">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-[#3c72d1] p-1.5 rounded-lg group-hover:rotate-12 transition-all shadow-xl shadow-blue-500/10">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter uppercase">Learnix<span className="text-[#3c72d1]">CRM</span></span>
                    </Link>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-white leading-[1.1] tracking-tight">
                            Build the <span className="text-[#3c72d1]">Future</span> <br />
                            of Education.
                        </h2>

                        <div className="space-y-3">
                            {[
                                "Advanced Lead Tracking",
                                "Team Performance Analytics",
                                "Admission Management"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-400">
                                    <CheckCircle2 size={16} className="text-[#3c72d1]" />
                                    <span className="text-base font-semibold">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pb-4">
                        <p className="text-xs text-gray-500 font-bold tracking-wide uppercase italic">
                            Streamlining Academic Excellence since 2024
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-slate-50 overflow-hidden">
                <div className="w-full max-w-[400px]">
                    <div className="text-center lg:text-left mb-4">
                        <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-3">
                            <GraduationCap className="text-[#3c72d1]" size={22} />
                            <span className="text-lg font-black text-slate-800 tracking-tighter uppercase">Learnix<span className="text-[#3c72d1]">CRM</span></span>
                        </Link>
                        <Link to="/login" className="inline-flex items-center gap-1 text-[9px] font-bold text-[#3c72d1] uppercase tracking-widest hover:gap-1.5 transition-all mb-1">
                            <ArrowLeft size={10} /> Back to Login
                        </Link>
                        <h2 className="text-slate-900 text-xl font-black tracking-tight">Create Account</h2>
                        <p className="text-slate-500 mt-0.5 text-[11px] font-medium leading-tight">Join our institutional network</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-2.5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 shadow-sm text-xs"
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 shadow-sm text-xs"
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 shadow-sm text-xs"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 shadow-sm text-xs"
                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</label>
                            <select
                                className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 cursor-pointer shadow-sm text-xs appearance-none"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="Sales">Sales Executive</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[#3c72d1] hover:bg-[#2d5dbd] text-white p-3.5 mt-1 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all disabled:opacity-50 text-xs">
                            <UserPlus size={16} /> {loading ? 'Processing...' : 'Request Access'}
                        </button>
                        {error && <p className="text-red-500 mt-1 text-center text-[9px] font-bold bg-red-50 py-1 rounded-lg border border-red-100">{error}</p>}
                    </form>

                    <div className="mt-4 text-center text-slate-400 text-[9px] font-medium leading-relaxed">
                        By registering, you agree to our <a href="#" className="text-[#3c72d1] underline font-bold">Terms</a> and <a href="#" className="text-[#3c72d1] underline font-bold">Privacy</a>.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

