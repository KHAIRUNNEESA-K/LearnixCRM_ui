import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    ArrowRight,
    CheckCircle2,
    Zap,
    Shield,
    Target,
    Users,
    BarChart3,
    ChevronRight,
    Github,
    Twitter,
    Linkedin,
    Instagram,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#3c72d1] selection:text-white">

            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-[#3c72d1] p-2 rounded-xl shadow-lg ring-4 ring-[#3c72d1]/10 group-hover:scale-110 transition-transform">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none text-[#1e293b]">Learnix<span className="text-[#3c72d1]">CRM</span></span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1">Software Institute</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                        <a href="#features" className="hover:text-[#3c72d1] transition-colors">Features</a>
                        <a href="#solutions" className="hover:text-[#3c72d1] transition-colors">Solutions</a>
                        <a href="#about" className="hover:text-[#3c72d1] transition-colors">About</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-bold text-slate-600 hover:text-[#3c72d1] px-4 py-2 transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-[#3c72d1] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#3c72d1]/20 hover:bg-[#2d5dbd] hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#3c72d1]/5 -skew-x-12 translate-x-1/2 -z-10 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-50 -skew-x-12 -translate-x-1/2 -z-10 blur-3xl rounded-full"></div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#3c72d1] text-[10px] font-black uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            v2.0 is now live
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#1e293b] leading-[1.1] tracking-tight">
                            Manage Your Institute <br />
                            <span className="text-[#3c72d1]">Like Never Before.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                            The ultimate CRM platform designed specifically for software training institutes. Streamline admissions, track leads, and scale your growth with data-driven insights.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/register')}
                                className="group bg-[#1e293b] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#334155] transition-all shadow-xl shadow-slate-200"
                            >
                                Start Free Trial
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#3c72d1]/20 to-transparent blur-2xl -z-10"></div>
                        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative group">
                            <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            </div>
                            <div className="p-4 bg-slate-50/50">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3c72d1] flex items-center justify-center mb-2">
                                            <Target size={16} />
                                        </div>
                                        <div className="h-2 w-12 bg-slate-100 rounded mb-1"></div>
                                        <div className="h-3 w-8 bg-[#3c72d1]/20 rounded"></div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2">
                                            <BarChart3 size={16} />
                                        </div>
                                        <div className="h-2 w-12 bg-slate-100 rounded mb-1"></div>
                                        <div className="h-3 w-20 bg-emerald-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse"></div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-32 bg-slate-100 rounded"></div>
                                            <div className="h-2 w-20 bg-slate-50 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-full bg-slate-50 rounded"></div>
                                        <div className="h-2 w-full bg-slate-50 rounded"></div>
                                        <div className="h-2 w-3/4 bg-slate-50 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative element over "dashboard" mock */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3c72d1] text-white p-6 rounded-3xl shadow-2xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500">
                                <div className="text-center">
                                    <p className="text-3xl font-black mb-1">85%</p>
                                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Efficiency Boost</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6 text-center mb-16 space-y-4">
                    <h2 className="text-[10px] font-black uppercase text-[#3c72d1] tracking-[0.3em]">Core Capabilities</h2>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight">Built for Growth Minded Institutes</h3>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Target className="text-[#3c72d1]" />,
                            title: "Lead Intelligence",
                            desc: "Capture, track and nurture prospects through an automated sales pipeline."
                        },
                        {
                            icon: <Users className="text-emerald-500" />,
                            title: "Team Performance",
                            desc: "Monitor manager and sales activity with real-time role-based access."
                        },
                        {
                            icon: <BarChart3 className="text-purple-500" />,
                            title: "Deep Analytics",
                            desc: "Gain crystal clear visibility into conversion rates and revenue growth."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">{feature.title}</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1e293b] text-white pt-24 pb-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#3c72d1]/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 border-b border-white/5 pb-16 mb-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#3c72d1] p-2 rounded-xl shadow-lg ring-4 ring-[#3c72d1]/10">
                                <GraduationCap size={24} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tight leading-none text-white">Learnix<span className="text-[#3c72d1]">CRM</span></span>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1">Software Institute</span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                            Revolutionizing how education institutes manage leads and student life-cycles. Empowering the future of tech education.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#3c72d1] transition-all"><Twitter size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#3c72d1] transition-all"><Linkedin size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#3c72d1] transition-all"><Github size={18} /></a>
                        </div>
                    </div>

                    <div className="space-y-6 md:ml-auto">
                        <h5 className="text-sm font-black uppercase tracking-widest text-[#3c72d1]">Contact Us</h5>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-center text-sm font-medium text-slate-400">
                                <Mail size={16} className="text-[#3c72d1]" />
                                contact@learnixcrm.com
                            </li>
                            <li className="flex gap-3 items-center text-sm font-medium text-slate-400">
                                <Phone size={16} className="text-[#3c72d1]" />
                                +91 98765 43210
                            </li>
                            <li className="flex gap-3 items-start text-sm font-medium text-slate-400">
                                <MapPin size={16} className="text-[#3c72d1] mt-1" />
                                Kochi, Ernakulam, <br /> Kerala, India
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <p>© 2024 LearnixCRM. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
