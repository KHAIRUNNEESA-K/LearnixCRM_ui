import React, { useState, useEffect } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import {
    Search,
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
    Loader,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const SalesFollowups = () => {
    const { user } = useAuth();
    const [followups, setFollowups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        // Mocking follow-up data
        const mockFollowups = [
            { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '9876543210', date: '2024-05-20', time: '10:00 AM', status: 'Pending', type: 'Call' },
            { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '9123456780', date: '2024-05-20', time: '02:30 PM', status: 'Overdue', type: 'Email' },
            { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', phone: '9988776655', date: '2024-05-21', time: '11:15 AM', status: 'Pending', type: 'Call' },
            { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '9000011111', date: '2024-05-21', time: '04:00 PM', status: 'Pending', type: 'Call' },
            { id: 5, name: 'Evan Wright', email: 'evan@example.com', phone: '9122334455', date: '2024-05-22', time: '09:30 AM', status: 'Completed', type: 'Call' },
            { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', phone: '9223344556', date: '2024-05-22', time: '01:00 PM', status: 'Pending', type: 'Meeting' },
            { id: 7, name: 'George Miller', email: 'george@example.com', phone: '9334455667', date: '2024-05-23', time: '10:30 AM', status: 'Pending', type: 'Call' },
        ];

        setLoading(true);
        setTimeout(() => {
            setFollowups(mockFollowups);
            setLoading(false);
        }, 800);
    }, []);

    const handleComplete = (id) => {
        setFollowups(followups.map(f => f.id === id ? { ...f, status: 'Completed' } : f));
        toast.success("Follow-up marked as completed");
    };

    const filteredFollowups = followups.filter(f => {
        const matchesSearch =
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || f.type === filterType;
        return matchesSearch && matchesType;
    });

    const totalPages = Math.ceil(filteredFollowups.length / ITEMS_PER_PAGE) || 1;
    const paginatedData = filteredFollowups.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <CRMLayout role="Sales" title="Follow-up Tracking">
            <div className="max-w-6xl mx-auto space-y-6 pb-12">

                {/* Header Summary */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Follow-ups</h1>
                        <p className="text-sm text-gray-500">Stay on top of your scheduled interactions</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2">
                            <Clock size={18} className="text-orange-500" />
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Today's Goal</p>
                                <p className="text-sm font-bold text-gray-700">12 Tasks</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2">
                            {['All', 'Call', 'Email', 'Meeting'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${filterType === type
                                        ? 'bg-[#3c72d1] text-white'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search prospect..."
                                className="w-full md:w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[350px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader className="animate-spin text-[#3c72d1]" size={32} />
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#f8fafc] border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Prospect</th>
                                        <th className="px-6 py-4">Schedule</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-gray-800">{item.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">{item.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-0.5">
                                                        <p className="flex items-center gap-1.5 text-gray-700 font-medium">
                                                            <Calendar size={14} className="text-gray-400" /> {item.date}
                                                        </p>
                                                        <p className="flex items-center gap-1.5 text-gray-500 text-xs">
                                                            <Clock size={14} className="text-gray-400" /> {item.time}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${item.type === 'Call' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        item.type === 'Email' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                            'bg-orange-50 text-orange-600 border-orange-100'
                                                        }`}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                        item.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {item.status !== 'Completed' ? (
                                                        <button
                                                            onClick={() => handleComplete(item.id)}
                                                            className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md hover:bg-emerald-100 border border-emerald-100 transition-colors"
                                                        >
                                                            Done
                                                        </button>
                                                    ) : (
                                                        <span className="text-emerald-500"><CheckCircle2 size={18} className="ml-auto" /></span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium italic">No follow-ups scheduled for this filter.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {!loading && filteredFollowups.length > 0 && (
                    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredFollowups.length)}</span> of <span className="font-semibold text-gray-700">{filteredFollowups.length}</span> entries
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
                                    className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === i + 1 ? 'text-white bg-[#3c72d1] border-[#3c72d1]' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
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

export default SalesFollowups;
