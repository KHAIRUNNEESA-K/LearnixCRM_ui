import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { FileText, Download, TrendingUp, Loader, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const Reports = () => {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState('leads'); // 'leads', 'admissions', 'performance'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;


    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'leads') res = await api.reports.getLeadsReport();
            else if (activeTab === 'admissions') res = await api.reports.getAdmissionsReport();
            else if (activeTab === 'performance') res = await api.reports.getPerformanceReport();
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
    const paginatedData = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };



    return (
        <CRMLayout role="Admin" title="Reports Center">

            <div className="max-w-6xl mx-auto pb-10">
                {/* Reports Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'leads' ? 'bg-white text-[#3c72d1] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Lead Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('admissions')}
                            className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'admissions' ? 'bg-white text-[#3c72d1] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Admission Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('performance')}
                            className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'performance' ? 'bg-white text-[#3c72d1] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Performance Reports
                        </button>
                    </div>

                </div>

                {/* Report Insights Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><BarChart2 size={24} /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Growth Rate</p>
                            <p className="text-xl font-black text-gray-800">+24.5%</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={24} /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Efficiency</p>
                            <p className="text-xl font-black text-gray-800">92.1%</p>
                        </div>
                    </div>
                </div>

                {/* Report Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 capitalize">{activeTab} Summary</h3>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Detailed breakdown of organizational {activeTab} data.</p>
                        </div>
                        <FileText size={32} className="text-gray-200" />
                    </div>

                    <div className="p-0">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
                                <Loader size={40} className="animate-spin text-[#3c72d1]" />
                                <span className="text-sm font-semibold">Generating report...</span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#f8fafc] border-b border-gray-100 uppercase text-[11px] font-bold tracking-wider text-gray-500">
                                        {activeTab === 'leads' && (
                                            <tr>
                                                <th className="px-8 py-4">Month</th>
                                                <th className="px-8 py-4 text-center">Total Leads</th>
                                                <th className="px-8 py-4 text-center">Converted</th>
                                                <th className="px-8 py-4 text-center">Pending</th>
                                                <th className="px-8 py-4 text-right">Revenue</th>
                                            </tr>
                                        )}
                                        {activeTab === 'admissions' && (
                                            <tr>
                                                <th className="px-8 py-4">Course Category</th>
                                                <th className="px-8 py-4 text-center">Student Count</th>
                                                <th className="px-8 py-4 text-right">Revenue</th>
                                                <th className="px-8 py-4 text-center">Trend</th>
                                            </tr>
                                        )}
                                        {activeTab === 'performance' && (
                                            <tr>
                                                <th className="px-8 py-4">Name</th>
                                                <th className="px-8 py-4">Role</th>
                                                <th className="px-8 py-4 text-center">Sales/Team Value</th>
                                                <th className="px-8 py-4 text-center">Achievement</th>
                                                <th className="px-8 py-4 text-center">Status</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {activeTab === 'leads' && paginatedData.map((item, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-8 py-5 font-bold text-gray-800">{item.month}</td>
                                                <td className="px-8 py-5 text-center font-medium text-gray-600">{item.totalLeads}</td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded text-xs font-bold ring-1 ring-emerald-100">{item.convertedLeads}</span>
                                                </td>
                                                <td className="px-8 py-5 text-center font-medium text-gray-500">{item.pendingLeads}</td>
                                                <td className="px-8 py-5 text-right font-black text-[#3c72d1]">₹{item.revenue.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {activeTab === 'admissions' && paginatedData.map((item, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-8 py-5 font-bold text-gray-800">{item.category}</td>
                                                <td className="px-8 py-5 text-center font-medium text-gray-600">{item.count}</td>
                                                <td className="px-8 py-5 text-right font-black text-emerald-600">{item.revenue}</td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${item.trend === 'up' ? 'bg-emerald-100 text-emerald-700' :
                                                        item.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {item.trend}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {activeTab === 'performance' && paginatedData.map((item, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="font-bold text-gray-800">{item.name}</div>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-medium text-gray-500">{item.role}</td>
                                                <td className="px-8 py-5 text-center font-bold text-gray-700">{item.teamSales || item.personalSales}</td>
                                                <td className="px-8 py-5 text-center font-black text-[#3c72d1]">{item.achievement}</td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination Controls */}
                {!loading && data.length > 0 && (
                    <div className="mt-6 flex items-center justify-between bg-white px-8 py-4 rounded-xl shadow-sm border border-gray-100">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-bold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, data.length)}</span> of <span className="font-bold text-gray-800">{data.length}</span> results
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 text-sm font-bold border rounded-md transition-all ${currentPage === 1 ? 'text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'}`}
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3.5 py-1.5 text-sm font-bold border rounded-md transition-all ${currentPage === i + 1 ? 'text-white bg-[#3c72d1] border-[#3c72d1] shadow-md shadow-blue-100' : 'text-gray-500 bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1.5 text-sm font-bold border rounded-md transition-all ${currentPage === totalPages ? 'text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </CRMLayout>
    );
};

export default Reports;
