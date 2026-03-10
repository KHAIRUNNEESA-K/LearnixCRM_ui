import React, { useState, useEffect } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import {
    Users,
    Calendar,
    TrendingUp,
    Loader,
    GraduationCap,
    Clock,
    Target,
    Activity,
    CheckCircle2,
    Phone,
    Mail,
    ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    Cell
} from 'recharts';

const SalesDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 156,
        todayFollowups: 8,
        activeLeads: 42,
        conversionRate: '24%'
    });

    const [monthlyData, setMonthlyData] = useState([]);
    const [weeklyLeads, setWeeklyLeads] = useState([]);
    const [todayTasks, setTodayTasks] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Monthly trend data (Last 6 months)
                const mockMonthly = [
                    { month: 'Jan', students: 12, rate: 18 },
                    { month: 'Feb', students: 18, rate: 21 },
                    { month: 'Mar', students: 25, rate: 20 },
                    { month: 'Apr', students: 32, rate: 25 },
                    { month: 'May', students: 28, rate: 22 },
                    { month: 'Jun', students: 41, rate: 28 },
                ];

                // Weekly lead activity
                const mockWeekly = [
                    { day: 'Mon', count: 4 },
                    { day: 'Tue', count: 7 },
                    { day: 'Wed', count: 5 },
                    { day: 'Thu', count: 9 },
                    { day: 'Fri', count: 12 },
                    { day: 'Sat', count: 6 },
                    { day: 'Sun', count: 3 },
                ];

                // Today's Followups
                const mockTasks = [
                    { id: 1, name: 'John Doe', time: '10:30 AM', type: 'Call', status: 'Pending' },
                    { id: 2, name: 'Global Solutions', time: '01:00 PM', type: 'Email', status: 'Pending' },
                    { id: 3, name: 'Alice Walker', time: '03:30 PM', type: 'Call', status: 'Pending' },
                    { id: 4, name: 'Future Tech', time: '05:00 PM', type: 'Meeting', status: 'Completed' },
                ];

                setTimeout(() => {
                    setMonthlyData(mockMonthly);
                    setWeeklyLeads(mockWeekly);
                    setTodayTasks(mockTasks);
                    setLoading(false);
                }, 800);
            } catch (error) {
                toast.error("Failed to load dashboard data");
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    return (
        <CRMLayout role="Sales" title="Sales Dashboard">
            <div className="max-w-7xl mx-auto space-y-6 pb-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Sales Command Center</h1>
                        <p className="text-sm text-gray-500 font-medium">Performance overview and active pipeline tracking</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                        <Calendar size={14} className="text-[#3c72d1]" />
                        <span>March 2024</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <Loader className="animate-spin text-[#3c72d1]" size={40} />
                    </div>
                ) : (
                    <>
                        {/* KPI Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-50 text-[#3c72d1] rounded-lg">
                                        <GraduationCap size={20} />
                                    </div>
                                    <span className="flex items-center gap-0.5 text-emerald-500 text-[10px] font-bold">
                                        <ArrowUpRight size={12} /> +12%
                                    </span>
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Students</h3>
                                <p className="text-2xl font-black text-gray-800 mt-1">{stats.totalStudents}</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                                        <Clock size={20} />
                                    </div>
                                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-widest">Priority</span>
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today's Followups</h3>
                                <p className="text-2xl font-black text-gray-800 mt-1">{stats.todayFollowups}</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                                        <Target size={20} />
                                    </div>
                                    <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Active</span>
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Leads</h3>
                                <p className="text-2xl font-black text-gray-800 mt-1">{stats.activeLeads}</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                                        <Activity size={20} />
                                    </div>
                                    <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Target</span>
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Conversion Rate</h3>
                                <p className="text-2xl font-black text-gray-800 mt-1">{stats.conversionRate}</p>
                            </div>
                        </div>

                        {/* Main Analytics Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Monthly Student Enrollment */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
                                    <GraduationCap size={18} className="text-[#3c72d1]" />
                                    Monthly Student Enrollment
                                </h3>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                                            <Tooltip
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                            />
                                            <Bar dataKey="students" fill="#3c72d1" radius={[4, 4, 0, 0]} barSize={30}>
                                                {monthlyData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === monthlyData.length - 1 ? '#3c72d1' : '#cbd5e1'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Monthly Conversion Rate */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
                                    <Activity size={18} className="text-emerald-500" />
                                    Monthly Conversion Rate (%)
                                </h3>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyData}>
                                            <defs>
                                                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} unit="%" />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="rate"
                                                stroke="#10b981"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorRate)"
                                                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                                activeDot={{ r: 6, strokeWidth: 0 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Weekly Active Lead Activity */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
                                    <TrendingUp size={18} className="text-[#3c72d1]" />
                                    Active Lead Inquiries (Weekly)
                                </h3>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={weeklyLeads}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3c72d1" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#3c72d1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="count" stroke="#3c72d1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Today's Followups List */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tight">
                                        <Clock size={18} className="text-orange-500" />
                                        Today's Tasks
                                    </h3>
                                    <button className="text-[10px] font-bold text-[#3c72d1] uppercase hover:underline">View All</button>
                                </div>
                                <div className="space-y-3 flex-1 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                                    {todayTasks.map((task) => (
                                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${task.type === 'Call' ? 'bg-blue-50 text-blue-600' : task.type === 'Meeting' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                                                    {task.type === 'Call' ? <Phone size={14} /> : task.type === 'Meeting' ? <Users size={14} /> : <Mail size={14} />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-800">{task.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">{task.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {task.status === 'Completed' ? (
                                                    <span className="text-emerald-500 bg-emerald-50 p-1 rounded-full"><CheckCircle2 size={14} /></span>
                                                ) : (
                                                    <button className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded transition-all">Mark Done</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </CRMLayout>
    );
};

export default SalesDashboard;
