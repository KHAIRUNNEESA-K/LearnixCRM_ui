import React, { useState, useEffect } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import {
    BarChart2,
    TrendingUp,
    Target,
    Users,
    Download,
    Calendar,
    ChevronDown,
    Loader
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const SalesReports = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        // Mocking report data
        const mockData = [
            { name: 'Mon', leads: 4, converted: 1, revenue: 1200 },
            { name: 'Tue', leads: 7, converted: 2, revenue: 2500 },
            { name: 'Wed', leads: 5, converted: 1, revenue: 1500 },
            { name: 'Thu', leads: 8, converted: 3, revenue: 4200 },
            { name: 'Fri', leads: 6, converted: 2, revenue: 3000 },
            { name: 'Sat', leads: 3, converted: 1, revenue: 1100 },
            { name: 'Sun', leads: 2, converted: 0, revenue: 0 },
        ];

        setLoading(true);
        setTimeout(() => {
            setReportData(mockData);
            setLoading(false);
        }, 1000);
    }, []);

    const handleExport = () => {
        toast.success("Performance report exported successfully");
    };

    return (
        <CRMLayout role="Sales" title="Sales Reports">
            <div className="max-w-6xl mx-auto space-y-6 pb-12">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Performance Reports</h1>
                        <p className="text-sm text-gray-500">Analyze your sales conversion and productivity</p>
                    </div>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <Download size={18} /> Export Report
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader className="animate-spin text-[#3c72d1]" size={40} />
                    </div>
                ) : (
                    <>
                        {/* Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:bg-slate-50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Conversion</p>
                                <p className="text-2xl font-black text-[#3c72d1]">24%</p>
                                <p className="text-[10px] text-emerald-500 font-bold mt-1">+2.4% vs last week</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:bg-slate-50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Revenue Generated</p>
                                <p className="text-2xl font-black text-gray-800">₹13,500</p>
                                <p className="text-[10px] text-emerald-500 font-bold mt-1">+12% target meet</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:bg-slate-50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Avg Deal Size</p>
                                <p className="text-2xl font-black text-gray-800">₹1,125</p>
                                <p className="text-[10px] text-blue-500 font-bold mt-1">Steady flow</p>
                            </div>
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-[#3c72d1]" />
                                    Conversion Rate (Weekly)
                                </h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={reportData}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3c72d1" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#3c72d1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#3c72d1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <BarChart2 size={20} className="text-emerald-500" />
                                    Leads vs Converted
                                </h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reportData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                            <Bar dataKey="leads" fill="#3c72d1" radius={[4, 4, 0, 0]} name="Inquiries" />
                                            <Bar dataKey="converted" fill="#10b981" radius={[4, 4, 0, 0]} name="Conversions" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </CRMLayout>
    );
};

export default SalesReports;
