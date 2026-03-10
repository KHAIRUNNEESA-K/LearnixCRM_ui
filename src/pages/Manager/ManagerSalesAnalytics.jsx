import React from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { IndianRupee, TrendingUp, Users, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const monthlyRevenue = [
    { name: 'Jan', revenue: 450000, target: 400000 },
    { name: 'Feb', revenue: 520000, target: 450000 },
    { name: 'Mar', revenue: 480000, target: 500000 },
    { name: 'Apr', revenue: 610000, target: 550000 },
    { name: 'May', revenue: 590000, target: 600000 },
    { name: 'Jun', revenue: 750000, target: 650000 },
];

const teamPerformanceData = [
    { manager: 'Manager A (Team Alpha)', sales: 125, conversionRate: 45, revenue: 1250000 },
    { manager: 'Manager B (Team Beta)', sales: 98, conversionRate: 38, revenue: 980000 },
    { manager: 'Manager C (Team Gamma)', sales: 145, conversionRate: 52, revenue: 1450000 },
    { manager: 'Manager D (Team Delta)', sales: 110, conversionRate: 41, revenue: 1100000 },
];

const managerWiseSales = [
    { name: 'Manager A', sales: 125, target: 120 },
    { name: 'Manager B', sales: 98, target: 110 },
    { name: 'Manager C', sales: 145, target: 130 },
    { name: 'Manager D', sales: 110, target: 100 },
];

const ManagerSalesAnalytics = () => {
    const { user } = useAuth();

    // Map the user to one of the managers in mock data
    const myTeamData = teamPerformanceData.find(t => t.manager.toLowerCase().includes(user?.name?.toLowerCase())) || teamPerformanceData[0];
    const mySalesData = managerWiseSales.find(t => t.name.toLowerCase().includes(user?.name?.toLowerCase())) || managerWiseSales[0];

    // Scale down monthly revenue for a single team's view
    const myRevenueData = monthlyRevenue.map(m => ({
        ...m,
        revenue: Math.ceil(m.revenue / 4),
        target: Math.ceil(m.target / 4)
    }));

    return (
        <CRMLayout role="Manager" title="Team Sales Analytics">

            <div className="max-w-7xl mx-auto pb-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-full bg-emerald-50 text-emerald-600"><IndianRupee size={24} /></div>
                            <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><ArrowUpRight size={16} /> +12.3%</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Team Revenue</p>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">₹{(myTeamData.revenue / 100000).toFixed(1)}L</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-full bg-blue-50 text-blue-600"><Target size={24} /></div>
                            <span className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full"><ArrowUpRight size={16} /> +5.2%</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Sales</p>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{myTeamData.sales}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-full bg-purple-50 text-purple-600"><TrendingUp size={24} /></div>
                            <span className="flex items-center text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full"><ArrowDownRight size={16} /> -1.1%</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</p>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{myTeamData.conversionRate}%</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-full bg-orange-50 text-orange-600"><Users size={24} /></div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Team Achievement</p>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{Math.round((mySalesData.sales / mySalesData.target) * 100)}%</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-[#2d3748] tracking-tight">Team Revenue Trend</h2>
                        </div>
                        <div className="p-6 h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={myRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTeamRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                                    <RechartsTooltip />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTeamRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-[#2d3748] tracking-tight">Sales vs Target</h2>
                        </div>
                        <div className="p-6 h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={myRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Bar dataKey="target" stackId="a" fill="#cbd5e1" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="revenue" name="Actual Revenue" stackId="b" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </CRMLayout>
    );
};

export default ManagerSalesAnalytics;
