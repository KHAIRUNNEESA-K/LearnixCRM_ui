import React, { useState, useEffect } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import {
    Search,
    GraduationCap,
    Clock,
    User,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
    Loader,
    CheckCircle2,
    Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const SalesStudents = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        fetchStudents();
    }, [user]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await api.admissions.getAll();
            // In a real app, we'd filter by the sales person who converted them
            // For mock, we show a subset as "my converted students"
            setStudents(data);
        } catch (error) {
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) || 1;
    const paginatedData = filteredStudents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <CRMLayout role="Sales" title="My Students">
            <div className="max-w-6xl mx-auto space-y-6 pb-12">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Students</h1>
                        <p className="text-sm text-gray-500">View and track students converted by you</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap size={20} className="text-[#3c72d1]" />
                            <span className="text-lg font-bold text-gray-700">Admission Records</span>
                        </div>

                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by student name..."
                                className="w-full md:w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader className="animate-spin text-[#3c72d1]" size={32} />
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#f8fafc] border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Course</th>
                                        <th className="px-6 py-4">Total Fee</th>
                                        <th className="px-6 py-4">Joining Date</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((s) => (
                                            <tr key={s.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-gray-800">{s.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">{s.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-medium text-gray-600">{s.course}</span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-700">
                                                    {s.totalFee}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {s.joiningDate}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase border border-emerald-100">
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No student records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {!loading && filteredStudents.length > 0 && (
                    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)}</span> of <span className="font-semibold text-gray-700">{filteredStudents.length}</span> students
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

export default SalesStudents;
