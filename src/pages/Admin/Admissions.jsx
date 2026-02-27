import React, { useState, useEffect } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import { Search, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const Admissions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const { user } = useAuth();


    useEffect(() => {
        const fetchAdmissions = async () => {
            try {
                setLoading(true);
                const data = await api.admissions.getAll();
                setStudents(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch admissions", err);
                setError("Failed to load admissions data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdmissions();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) || 1;
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <CRMLayout role="Admin" title="Admissions">

            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Students Overview</h2>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or course..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 bg-gray-50 focus:bg-white transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-gray-500 gap-3">
                                <Loader className="animate-spin text-[#3c72d1]" size={32} />
                                <span className="text-sm font-medium">Loading admissions data...</span>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-red-500 gap-2">
                                <p className="text-sm font-semibold">{error}</p>
                                <button onClick={() => window.location.reload()} className="text-[#3c72d1] text-xs font-semibold hover:underline mt-2">Retry</button>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f8fafc] border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">Contact Info</th>
                                        <th className="px-6 py-4">Course Enrolled</th>
                                        <th className="px-6 py-4">Total Amount</th>
                                        <th className="px-6 py-4">Joining Date</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {paginatedStudents.length > 0 ? (
                                        paginatedStudents.map((student) => (
                                            <tr key={student.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-800">{student.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-700 font-medium">{student.email}</div>
                                                    <div className="text-gray-500 text-xs mt-0.5">{student.phone}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex px-2.5 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
                                                        {student.course}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-[#3c72d1]">
                                                    {student.totalFee}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                                                    {new Date(student.joiningDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                                                No students found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Pagination Controls */}
                {!loading && !error && filteredStudents.length > 0 && (
                    <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)}</span> of <span className="font-semibold text-gray-700">{filteredStudents.length}</span> students
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === i + 1 ? 'text-white bg-[#3c72d1] border-[#3c72d1]' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
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

export default Admissions;
