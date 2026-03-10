import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { Users, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const initialAssignments = [
    { id: 1, managerId: 1, managerName: 'Nisa', managerEmail: 'manager@learnix.com', salesId: 101, salesName: 'Sidharth', salesEmail: 'sid@learnix.com', phone: '9207769041', status: 'Active', since: 'Oct 12, 2025' },
    { id: 2, managerId: 1, managerName: 'Nisa', managerEmail: 'manager@learnix.com', salesId: 102, salesName: 'John Doe', salesEmail: 'john.d@learnix.com', phone: '9876543210', status: 'Active', since: 'Nov 05, 2025' },
    { id: 3, managerId: 2, managerName: 'Alice Manager', managerEmail: 'alice.m@learnix.com', salesId: 103, salesName: 'Mark Smith', salesEmail: 'mark@learnix.com', phone: '8877665544', status: 'Active', since: 'Oct 20, 2025' },
    { id: 4, managerId: 3, managerName: 'Daniel Orta', managerEmail: 'dan.o@learnix.com', salesId: 104, salesName: 'Emily Clark', salesEmail: 'emily@learnix.com', phone: '7766554433', status: 'Active', since: 'Dec 01, 2025' },
    { id: 5, managerId: 4, managerName: 'Grace Hopper', managerEmail: 'grace.h@learnix.com', salesId: 105, salesName: 'Michael Sales', salesEmail: 'michael@learnix.com', phone: '6655443322', status: 'Active', since: 'Sep 15, 2025' },
    { id: 6, managerId: 1, managerName: 'Nisa', managerEmail: 'manager@learnix.com', salesId: 106, salesName: 'Bob Carter', salesEmail: 'bob.c@learnix.com', phone: '5544332211', status: 'Active', since: 'Jan 10, 2026' },
    { id: 7, managerId: 2, managerName: 'Alice Manager', managerEmail: 'alice.m@learnix.com', salesId: 107, salesName: 'Cynthia Liu', salesEmail: 'cynthia.l@learnix.com', phone: '4433221100', status: 'Active', since: 'Nov 22, 2025' },
    { id: 8, managerId: 3, managerName: 'Daniel Orta', managerEmail: 'dan.o@learnix.com', salesId: 108, salesName: 'Elena Gilbert', salesEmail: 'elena.g@learnix.com', phone: '3322110099', status: 'Active', since: 'Oct 15, 2025' },
    { id: 9, managerId: 1, managerName: 'Nisa', managerEmail: 'manager@learnix.com', salesId: 109, salesName: 'Sarah Connor', salesEmail: 'sarah.c@learnix.com', phone: '2211009988', status: 'Active', since: 'Feb 01, 2026' },
    { id: 10, managerId: 1, managerName: 'Nisa', managerEmail: 'manager@learnix.com', salesId: 110, salesName: 'Caleb Rivers', salesEmail: 'caleb.r@learnix.com', phone: '1100998877', status: 'Away', since: 'Dec 15, 2025' },
    { id: 11, managerId: 1, managerName: 'Nisa', managerEmail: 'manager@learnix.com', salesId: 111, salesName: 'Aria Montgomery', salesEmail: 'aria.m@learnix.com', phone: '9900887766', status: 'Active', since: 'Jan 20, 2026' },
];

const ManagerTeamManagement = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        // Filter assignments for this specific manager
        // In dummy mode, we show the data if the user is a Manager, regardless of the test email
        const isManager = user?.role === 'Manager' || user?.email?.includes('manager') || !user;
        const myTeam = initialAssignments.filter(a =>
            a.managerEmail === user?.email || (isManager && a.managerEmail === 'manager@learnix.com')
        );
        setAssignments(myTeam);
    }, [user]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredAssignments = assignments.filter(a =>
        a.salesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.salesEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE) || 1;
    const paginatedAssignments = filteredAssignments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <CRMLayout role="Manager" title="My Sales Team">

            <div className="max-w-6xl mx-auto space-y-6">

                {/* Team Stats */}
                <div className="bg-[#3c72d1] rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-center items-center p-8 relative">
                    <Users size={80} className="opacity-20 absolute top-4 right-4" />
                    <h3 className="text-5xl font-black mb-2">{assignments.length}</h3>
                    <p className="font-semibold text-blue-100 uppercase tracking-widest text-sm">Total Sales Executives in Your Team</p>
                </div>

                {/* Team Assignments Viewer */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Team Roster</h2>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f8fafc] text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Sales Executive</th>
                                    <th className="px-6 py-4">Contact Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Assigned Since</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedAssignments.length > 0 ? paginatedAssignments.map((assignment) => (
                                    <tr key={assignment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                                {assignment.salesName.charAt(0)}
                                            </div>
                                            {assignment.salesName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-700 font-medium">{assignment.salesEmail}</div>
                                            <div className="text-gray-500 text-xs mt-0.5">{assignment.phone || '987-654-3210'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ring-1 ${assignment.status === 'Active' ? 'bg-emerald-100 text-emerald-700 ring-emerald-200' : 'bg-amber-100 text-amber-700 ring-amber-200'
                                                }`}>
                                                {assignment.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs italic">
                                            {assignment.since || 'Oct 12, 2025'}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium">You don't have any sales executives assigned to your team yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredAssignments.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 mt-4 rounded-b-lg">
                            <span className="text-sm text-gray-500">
                                Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAssignments.length)}</span> of <span className="font-semibold text-gray-700">{filteredAssignments.length}</span> entries
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
                                        className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === i + 1 ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
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

            </div>
        </CRMLayout>
    );
};

export default ManagerTeamManagement;
