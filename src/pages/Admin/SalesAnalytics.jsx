import React from 'react';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { IndianRupee, TrendingUp, Users, Target, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const monthlyRevenue = [
    { name: 'Jan', revenue: 450000, target: 400000 },
    { name: 'Feb', revenue: 520000, target: 450000 },
    { name: 'Mar', revenue: 480000, target: 500000 },
    { name: 'Apr', revenue: 610000, target: 550000 },
    { name: 'May', revenue: 590000, target: 600000 },
    { name: 'Jun', revenue: 750000, target: 650000 },
];

const monthlySalesDetails = [
    { name: 'Jan', service: 1500, product: 1000, other: 500 },
    { name: 'Feb', service: 2000, product: 1500, other: 1000 },
    { name: 'Mar', service: 1800, product: 1600, other: 1100 },
    { name: 'Apr', service: 4000, product: 3500, other: 2000 },
    { name: 'May', service: 5500, product: 4500, other: 3000 },
    { name: 'Jun', service: 7000, product: 6000, other: 3500 },
    { name: 'Jul', service: 10000, product: 8000, other: 5000 },
    { name: 'Aug', service: 14000, product: 10000, other: 4500 },
    { name: 'Sep', service: 17000, product: 11000, other: 4500 },
    { name: 'Oct', service: 18000, product: 11000, other: 4500 },
    { name: 'Nov', service: 15000, product: 10000, other: 5000 },
    { name: 'Dec', service: 16000, product: 11000, other: 4500 },
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

const meanPerformanceData = [
    { name: 'Avg Closing Rate', value: 44, full: 100, fill: '#10b981' },
    { name: 'Avg Deal Size', value: 65, full: 100, fill: '#3b82f6' },
    { name: 'Avg Outreach', value: 82, full: 100, fill: '#f59e0b' },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

const SalesAnalytics = () => {
    const { user } = useAuth();


    // Calculate sum for top cards
    const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
    const totalSales = teamPerformanceData.reduce((sum, item) => sum + item.sales, 0);
    const avgConversion = (teamPerformanceData.reduce((sum, item) => sum + item.conversionRate, 0) / teamPerformanceData.length).toFixed(1);

    return (
        <CRMLayout role="Admin" title="Sales Analytics">

            <div className="max-w-7xl mx-auto pb-10">
                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
                                <IndianRupee size={24} />
                            </div>
                            <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <ArrowUpRight size={16} className="mr-1" /> +15.3%
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">₹{(totalRevenue / 100000).toFixed(1)}L</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                                <Target size={24} />
                            </div>
                            <span className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                <ArrowUpRight size={16} className="mr-1" /> +8.2%
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Sales</p>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{totalSales}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                                <TrendingUp size={24} />
                            </div>
                            <span className="flex items-center text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                <ArrowDownRight size={16} className="mr-1" /> -2.1%
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Avg Conversion Rate</p>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{avgConversion}%</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-full bg-orange-50 text-orange-600">
                                <Users size={24} />
                            </div>
                            <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <ArrowUpRight size={16} className="mr-1" /> +4.5%
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Active Teams/Managers</p>
                            <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{teamPerformanceData.length}</h3>
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Monthly Sales Stacked Bar Chart */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden lg:col-span-2 flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex flex-col items-start gap-1">
                            <h2 className="text-xl font-bold text-[#2d3748] tracking-tight">Monthly Sales</h2>
                            <p className="text-sm font-semibold text-gray-500">Revenue in Last 12 Months</p>
                        </div>
                        <div className="p-6 flex-1 min-h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlySalesDetails} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <RechartsTooltip
                                        cursor={{ fill: 'transparent' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const total = payload.reduce((sum, entry) => sum + entry.value, 0);
                                                return (
                                                    <div className="bg-[#2d3748] text-white px-3 py-1.5 rounded-md shadow-lg text-sm font-bold relative -top-8 flex flex-col items-center">
                                                        <span>${total.toLocaleString()}</span>
                                                        <div className="absolute top-full border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#2d3748]"></div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="service" stackId="a" fill="#b94e4e" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="product" stackId="a" fill="#dd743f" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="other" stackId="a" fill="#f6993f" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Mean Team Performance Radial/Bar */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Mean Team Performance</h2>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-center gap-6 min-h-[300px]">
                            {meanPerformanceData.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                                        <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div className="h-3 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.fill }}></div>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 mt-1 text-blue-600"><TrendingUp size={18} /></div>
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-900 mb-1">Overall Team Health is Good</h4>
                                        <p className="text-xs text-blue-700 leading-relaxed">The active teams show an average closing rate of {avgConversion}%, putting overall efficiency at the top 20th percentile.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manager Wise Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden lg:col-span-1 flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Manager Wise Sales</h2>
                        </div>
                        <div className="p-6 flex-1 min-h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={managerWiseSales} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} width={80} />
                                    <RechartsTooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                    <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={12} />
                                    <Bar dataKey="sales" name="Actual Sales" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Manager & Team Breakdown</h2>
                            <button
                                onClick={() => toast.success('Report exported successfully to Excel!', { toastId: 'sales-export' })}
                                className="text-sm flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-700 transition"
                            >
                                <Download size={16} /> Export Report
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Manager / Team</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total Sales</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Conversion Rate</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Revenue Generated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamPerformanceData.map((team, index) => (
                                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs`} style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                                                        {team.manager.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-gray-800 text-sm">{team.manager}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-700">{team.sales}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${team.conversionRate >= 45 ? 'bg-emerald-100 text-emerald-700' : team.conversionRate >= 40 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {team.conversionRate}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-800">₹{team.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </CRMLayout>
    );
};

export default SalesAnalytics;
