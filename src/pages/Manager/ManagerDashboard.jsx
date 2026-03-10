import React, { useEffect, useState } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const salesData = [
    { name: 'Jan', value: 150 },
    { name: 'Feb', value: 180 },
    { name: 'Mar', value: 160 },
    { name: 'Apr', value: 210 },
    { name: 'May', value: 280 },
    { name: 'Jun', value: 250 },
    { name: 'Jul', value: 320 },
];

const salesPerformanceData = [
    { name: 'Jan', value: 75 },
    { name: 'Feb', value: 82 },
    { name: 'Mar', value: 78 },
    { name: 'Apr', value: 95 },
    { name: 'May', value: 110 },
    { name: 'Jun', value: 105 },
    { name: 'Jul', value: 125 },
];

const studentData = [
    { name: 'Jan', value: 35 },
    { name: 'Feb', value: 40 },
    { name: 'Mar', value: 28 },
    { name: 'Apr', value: 45 },
    { name: 'May', value: 65 },
    { name: 'Jun', value: 50 },
    { name: 'Jul', value: 70 },
];

const performanceData = [
    { name: 'Achieved', value: 80 },
    { name: 'Remaining', value: 20 },
];

const COLORS = ['#3A75E4', '#e2e8f0'];
const STUDENT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const leadStatusData = [
    { name: 'New', value: 12 },
    { name: 'Contacted', value: 45 },
    { name: 'Qualified', value: 23 },
    { name: 'Converted', value: 15 },
    { name: 'Lost', value: 8 }
];

const LEAD_STATUS_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#14B8A6', '#EF4444'];

const leadAllocationData = [
    { name: 'Sarah Connor', leads: 24 },
    { name: 'John Miller', leads: 32 },
    { name: 'Sidharth', leads: 28 },
    { name: 'Bob Carter', leads: 15 },
    { name: 'Cynthia Liu', leads: 22 },
];

const ManagerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ targeted: '₹0', capacity: '0/0', pendingLeads: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await api.dashboard.getManagerStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load manager dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    return (
        <CRMLayout role="Manager" title="Manager Dashboard">
            <div className="max-w-5xl mx-auto pb-10">
                <h2 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">Lead Overview </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    {leadStatusData.map((status, index) => (
                        <div key={status.name} className="p-4 rounded-lg bg-white shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold text-gray-800 mb-1">{status.value}</div>
                            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: LEAD_STATUS_COLORS[index] }}>{status.name}</div>
                        </div>
                    ))}
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">Sales Overview</h2>
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-[32px] font-bold text-gray-800 tracking-tight">{stats.targeted}</span>
                            <span className="text-sm font-semibold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+8%</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Team Revenue Target</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                        <div className="flex items-end gap-3 mb-1">
                            <span className="text-[32px] font-bold text-gray-800 tracking-tight">84</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Team Total Students</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Monthly Revenue</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-medium text-gray-500 mb-6">Team Revenue Growth</p>
                            <div className="h-72 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="colorRevenueTeam" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} tickMargin={10} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`₹${value}`, 'Revenue']}
                                        />
                                        <Area type="linear" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueTeam)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Total Students</h2>
                        </div>
                        <div className="p-6 flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-6">Team Student Enrollments</p>
                            <div className="h-72 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <PieChart>
                                        <Pie
                                            data={studentData}
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={3}
                                            dataKey="value"
                                            nameKey="name"
                                            stroke="none"
                                        >
                                            {studentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={STUDENT_COLORS[index % STUDENT_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '4px 8px' }}
                                            itemStyle={{ color: '#1e293b', fontSize: '14px', fontWeight: 600 }}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Sales Report</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-medium text-gray-500 mb-6">Team Sales Performance</p>
                            <div className="h-72 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="colorValueTeam" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3A75E4" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#3A75E4" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} tickMargin={10} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`₹${value}`, 'Sales']}
                                        />
                                        <Area type="linear" dataKey="value" stroke="#3A75E4" strokeWidth={3} fillOpacity={1} fill="url(#colorValueTeam)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3A75E4' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Sales Performance</h2>
                        </div>
                        <div className="p-6 flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-6">Monthly Team Achievement</p>
                            <div className="h-72 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <BarChart data={salesPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} tickMargin={10} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [value, 'Performance Score']}
                                        />
                                        <Bar dataKey="value" fill="#3A75E4" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:col-span-1">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Performance Goal</h2>
                        </div>
                        <div className="p-6 flex-1 flex flex-col items-center justify-center">
                            <div className="h-48 w-full relative mb-4">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <PieChart>
                                        <Pie
                                            data={performanceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {performanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '4px 8px' }}
                                            itemStyle={{ color: '#1e293b', fontSize: '14px', fontWeight: 600 }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-bold text-gray-800">80%</span>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wilder mt-1">Goal</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#3A75E4]"></div>
                                    <span className="text-sm font-medium text-gray-600">Achieved</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#e2e8f0]"></div>
                                    <span className="text-sm font-medium text-gray-600">Remaining</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Lead Allocation by Sales Rep</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-medium text-gray-500 mb-6">Leads Distributed among your team members</p>
                            <div className="h-48 w-full mt-2 flex items-center">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <BarChart
                                        layout="vertical"
                                        data={leadAllocationData}
                                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} width={120} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [value, 'Assigned Leads']}
                                        />
                                        <Bar dataKey="leads" fill="#f59e0b" radius={[0, 4, 4, 0]} maxBarSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CRMLayout>
    );
};

export default ManagerDashboard;
