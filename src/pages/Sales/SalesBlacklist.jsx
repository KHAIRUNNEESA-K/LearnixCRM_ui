import React, { useState, useEffect } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import {
    Search,
    ShieldAlert,
    Ban,
    UserX,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader,
    Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const SalesBlacklist = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        // Mocking blacklist data
        const mockBlacklist = [
            { id: 101, name: 'Spam User 1', email: 'spam1@example.com', reason: 'Fake inquiry', date: '2024-05-10', severity: 'High' },
            { id: 102, name: 'Bot Tester', email: 'bot@tester.com', reason: 'Automated submissions', date: '2024-05-12', severity: 'Medium' },
            { id: 103, name: 'Invalid Contact', email: 'none@none.com', reason: 'Invalid phone/email', date: '2024-05-15', severity: 'Low' },
            { id: 104, name: 'Competitor Research', email: 'rival@competitor.com', reason: 'Checking pricing only', date: '2024-05-18', severity: 'Medium' },
        ];

        setLoading(true);
        setTimeout(() => {
            setLeads(mockBlacklist);
            setLoading(false);
        }, 700);
    }, []);

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1;
    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <CRMLayout role="Sales" title="Blacklist Registry">
            <div className="max-w-6xl mx-auto space-y-6 pb-12">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Blacklisted Leads</h1>
                        <p className="text-sm text-gray-500">Excluded prospects and restricted contacts</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-red-50 bg-red-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-red-600 font-bold">
                            <ShieldAlert size={20} />
                            <span>Restricted Access List</span>
                        </div>

                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search blacklist..."
                                className="w-full md:w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader className="animate-spin text-red-500" size={32} />
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#fef2f2] border-b border-red-50 text-xs text-red-400 uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Reason for Listing</th>
                                        <th className="px-6 py-4">Date Added</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {paginatedLeads.length > 0 ? (
                                        paginatedLeads.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-50 hover:bg-red-50/10 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-gray-800">{item.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">{item.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">
                                                    {item.reason}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {item.date}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                                                        <Info size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium italic">No blacklisted entries found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {!loading && filteredLeads.length > 0 && (
                    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)}</span> of <span className="font-semibold text-gray-700">{filteredLeads.length}</span> entries
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === i + 1 ? 'text-white bg-red-500 border-red-500' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </CRMLayout>
    );
};

export default SalesBlacklist;
