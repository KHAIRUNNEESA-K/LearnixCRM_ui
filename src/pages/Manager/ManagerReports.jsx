import React, { useState, useEffect } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import { FileText, TrendingUp, Loader, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const ManagerReports = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('performance'); // 'leads', 'admissions', 'performance'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'leads') {
                res = await api.reports.getLeadsReport();
                // Simulate team-specific aggregation by scaling values down for a single team
                res = res.map(item => ({
                    ...item,
                    totalLeads: Math.ceil(item.totalLeads / 4),
                    convertedLeads: Math.ceil(item.convertedLeads / 4),
                    pendingLeads: Math.ceil(item.pendingLeads / 4),
                    revenue: Math.ceil(item.revenue / 4)
                }));
            }
            else if (activeTab === 'admissions') {
                res = await api.reports.getAdmissionsReport();
                res = res.slice(0, 5); // Only show first few categories for the team
            }
            else if (activeTab === 'performance') {
                res = await api.reports.getPerformanceReport();
                // Filter performance to only show the manager themselves and their generic team (based on current user name)
                const myName = user?.name || 'Manager';
                res = res.filter(item => item.name === myName || item.role === 'Sales');
                // In a real app, sales would be linked to the manager. 
                // Here we'll just show the first 3 sales as "the team"
                if (res.length > 4) res = res.slice(0, 4);
            }
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setCurrentPage(1);
    }, [activeTab]);

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;
    const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <CRMLayout role="Manager" title="My Team Reports">
            <div className="max-w-6xl mx-auto pb-10">
                <div className="flex bg-gray-100 p-1 rounded-lg w-fit mb-8">
                    {['performance', 'leads', 'admissions'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 text-sm font-bold rounded-md transition-all capitalize ${activeTab === tab ? 'bg-white text-[#3c72d1] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><BarChart2 size={24} /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Team Performance</p>
                            <p className="text-xl font-black text-gray-800">94.2%</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={24} /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Team Conversion</p>
                            <p className="text-xl font-black text-gray-800">38.5%</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 capitalize">Your {activeTab} Summary</h3>
                        <FileText size={24} className="text-gray-300" />
                    </div>

                    <div className="p-0">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
                                <Loader size={40} className="animate-spin text-[#3c72d1]" />
                                <span className="text-sm font-semibold">Generating Team Report...</span>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-[#f8fafc] border-b border-gray-100 uppercase text-[11px] font-bold tracking-wider text-gray-500">
                                    {activeTab === 'leads' && (
                                        <tr>
                                            <th className="px-8 py-4">Month</th>
                                            <th className="px-8 py-4">Total Leads</th>
                                            <th className="px-8 py-4">Converted</th>
                                            <th className="px-8 py-4 text-right">Team Revenue</th>
                                        </tr>
                                    )}
                                    {activeTab === 'admissions' && (
                                        <tr>
                                            <th className="px-8 py-4">Course Category</th>
                                            <th className="px-8 py-4">Student Count</th>
                                            <th className="px-8 py-4 text-right">Revenue</th>
                                            <th className="px-8 py-4 text-center">Trend</th>
                                        </tr>
                                    )}
                                    {activeTab === 'performance' && (
                                        <tr>
                                            <th className="px-8 py-4">Team Member</th>
                                            <th className="px-8 py-4">Role</th>
                                            <th className="px-8 py-4 text-center">Sales Value</th>
                                            <th className="px-8 py-4 text-center">Achievement</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {activeTab === 'leads' && paginatedData.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-5 font-bold text-gray-800">{item.month}</td>
                                            <td className="px-8 py-5 text-gray-600">{item.totalLeads}</td>
                                            <td className="px-8 py-5"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded text-xs font-bold">{item.convertedLeads}</span></td>
                                            <td className="px-8 py-5 text-right font-black text-[#3c72d1]">₹{item.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {activeTab === 'admissions' && paginatedData.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-5 font-bold text-gray-800">{item.category}</td>
                                            <td className="px-8 py-5 text-gray-600">{item.count}</td>
                                            <td className="px-8 py-5 text-right font-black text-emerald-600">{item.revenue}</td>
                                            <td className="px-8 py-5 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">{item.trend}</span></td>
                                        </tr>
                                    ))}
                                    {activeTab === 'performance' && paginatedData.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-5 font-bold text-gray-800">{item.name}</td>
                                            <td className="px-8 py-5 text-sm font-medium text-gray-500">{item.role}</td>
                                            <td className="px-8 py-5 text-center font-bold text-gray-700">₹{item.teamSales || item.personalSales}</td>
                                            <td className="px-8 py-5 text-center font-black text-[#3c72d1]">{item.achievement}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </CRMLayout>
    );
};

export default ManagerReports;
