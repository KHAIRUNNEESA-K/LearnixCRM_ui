import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { UserPlus, Users, Trash2, Edit, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const mockManagers = [
    { id: 1, name: 'Nisa', email: 'manager@learnix.com', role: 'Manager' },
    { id: 2, name: 'Alice Manager', email: 'alice.m@learnix.com', role: 'Manager' },
    { id: 3, name: 'Daniel Orta', email: 'dan.o@learnix.com', role: 'Manager' },
    { id: 4, name: 'Grace Hopper', email: 'grace.h@learnix.com', role: 'Manager' },
];

const mockSales = [
    { id: 101, name: 'Sidharth', email: 'sales@learnix.com', role: 'Sales' },
    { id: 102, name: 'John Doe', email: 'johndoe@learnix.com', role: 'Sales' },
    { id: 103, name: 'Mark Smith', email: 'mark@learnix.com', role: 'Sales' },
    { id: 104, name: 'Emily Clark', email: 'emily@learnix.com', role: 'Sales' },
    { id: 105, name: 'Michael Sales', email: 'michael@learnix.com', role: 'Sales' },
    { id: 106, name: 'Bob Carter', email: 'bob.c@learnix.com', role: 'Sales' },
    { id: 107, name: 'Cynthia Liu', email: 'cynthia.l@learnix.com', role: 'Sales' },
    { id: 108, name: 'Elena Gilbert', email: 'elena.g@learnix.com', role: 'Sales' },
];

const initialAssignments = [
    { id: 1, managerId: 1, managerName: 'Nisa', managerEmail: 'manager@learnix.com', salesId: 101, salesName: 'Sidharth', salesEmail: 'sales@learnix.com' },
    { id: 2, managerId: 1, managerName: 'Nisa', managerEmail: 'manager@learnix.com', salesId: 102, salesName: 'John Doe', salesEmail: 'johndoe@learnix.com' },
    { id: 3, managerId: 2, managerName: 'Alice Manager', managerEmail: 'alice.m@learnix.com', salesId: 103, salesName: 'Mark Smith', salesEmail: 'mark@learnix.com' },
    { id: 4, managerId: 3, managerName: 'Daniel Orta', managerEmail: 'dan.o@learnix.com', salesId: 104, salesName: 'Emily Clark', salesEmail: 'emily@learnix.com' },
    { id: 5, managerId: 4, managerName: 'Grace Hopper', managerEmail: 'grace.h@learnix.com', salesId: 105, salesName: 'Michael Sales', salesEmail: 'michael@learnix.com' },
    { id: 6, managerId: 1, managerName: 'Nisa', managerEmail: 'manager@learnix.com', salesId: 106, salesName: 'Bob Carter', salesEmail: 'bob.c@learnix.com' },
    { id: 7, managerId: 2, managerName: 'Alice Manager', managerEmail: 'alice.m@learnix.com', salesId: 107, salesName: 'Cynthia Liu', salesEmail: 'cynthia.l@learnix.com' },
    { id: 8, managerId: 3, managerName: 'Daniel Orta', managerEmail: 'dan.o@learnix.com', salesId: 108, salesName: 'Elena Gilbert', salesEmail: 'elena.g@learnix.com' },
];

const TeamManagement = () => {
    const { user } = useAuth();

    const [assignments, setAssignments] = useState(initialAssignments);
    const [selectedManager, setSelectedManager] = useState('');
    const [selectedSales, setSelectedSales] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grouped'
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;


    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, viewMode]);

    const handleAssign = (e) => {
        e.preventDefault();
        if (!selectedManager || !selectedSales) return;

        const manager = mockManagers.find(m => m.id === parseInt(selectedManager));
        const sales = mockSales.find(s => s.id === parseInt(selectedSales));

        if (editMode && editId) {
            setAssignments(assignments.map(a =>
                a.id === editId
                    ? { ...a, managerId: manager.id, managerName: manager.name, managerEmail: manager.email, salesId: sales.id, salesName: sales.name, salesEmail: sales.email }
                    : a
            ));
            toast.success('Assignment updated successfully', { toastId: 'team-update' });
            setEditMode(false);
            setEditId(null);
        } else {
            // Check if sales is already assigned to avoid duplicates (optional, but good practice)
            const exists = assignments.find(a => a.salesId === sales.id);
            if (exists) {
                toast.warning('Sales Executive is already assigned to a manager. Please reassign them instead.', { toastId: 'team-duplicate' });
                return;
            }
            const newAssignment = {
                id: Date.now(),
                managerId: manager.id,
                managerName: manager.name,
                managerEmail: manager.email,
                salesId: sales.id,
                salesName: sales.name,
                salesEmail: sales.email
            };
            setAssignments([...assignments, newAssignment]);
            toast.success('New assignment created successfully', { toastId: 'team-create' });
        }

        setSelectedManager('');
        setSelectedSales('');
    };

    const handleEdit = (assignment) => {
        setEditMode(true);
        setEditId(assignment.id);
        setSelectedManager(assignment.managerId.toString());
        setSelectedSales(assignment.salesId.toString());
    };

    const handleDelete = (id) => {
        setAssignments(assignments.filter(a => a.id !== id));
        toast.info('Assignment removed successfully', { toastId: 'team-delete' });
    };

    const filteredAssignments = assignments.filter(a =>
        a.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.salesName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Grouping for "Manager Wise Sales Team" view
    const groupedAssignments = filteredAssignments.reduce((acc, assignment) => {
        if (!acc[assignment.managerName]) {
            acc[assignment.managerName] = [];
        }
        acc[assignment.managerName].push(assignment);
        return acc;
    }, {});

    const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE) || 1;
    const paginatedAssignments = filteredAssignments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <CRMLayout role="Admin" title="Team Management">

            <div className="max-w-6xl mx-auto space-y-6">

                {/* Assignment Form & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden text-sm">
                        <div className="px-6 py-4 border-b border-gray-100 bg-[#f8fafc]">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <UserPlus size={18} className="text-[#3c72d1]" />
                                {editMode ? 'Reassign Sales Executive' : 'Assign Sales to Manager'}
                            </h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAssign} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Select Manager</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3c72d1] focus:border-[#3c72d1] outline-none"
                                        value={selectedManager}
                                        onChange={(e) => setSelectedManager(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Manager --</option>
                                        {mockManagers.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Select Sales Executive</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3c72d1] focus:border-[#3c72d1] outline-none"
                                        value={selectedSales}
                                        onChange={(e) => setSelectedSales(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Sales Exec --</option>
                                        {mockSales.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full md:w-auto flex gap-2">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-[#3c72d1] text-white font-semibold rounded-md hover:bg-blue-700 transition w-full md:w-auto"
                                    >
                                        {editMode ? 'Update' : 'Assign'}
                                    </button>
                                    {editMode && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditMode(false); setSelectedManager(''); setSelectedSales(''); setEditId(null); }}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="bg-[#3c72d1] rounded-lg shadow-sm overflow-hidden text-white flex flex-col justify-center items-center p-6 relative">
                        <Users size={64} className="opacity-20 absolute top-4 right-4" />
                        <h3 className="text-4xl font-black mb-2">{assignments.length}</h3>
                        <p className="font-semibold text-blue-100 uppercase tracking-widest text-xs">Total Assigned Team Members</p>
                    </div>
                </div>

                {/* Team Assignments Viewer */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Team Roster</h2>
                            <div className="flex bg-gray-100 p-1 rounded-md">
                                <button
                                    className={`px-3 py-1 text-xs font-semibold rounded ${viewMode === 'list' ? 'bg-white text-[#3c72d1] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    All Assignments
                                </button>
                                <button
                                    className={`px-3 py-1 text-xs font-semibold rounded ${viewMode === 'grouped' ? 'bg-white text-[#3c72d1] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setViewMode('grouped')}
                                >
                                    Manager Wise
                                </button>
                            </div>
                        </div>
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

                    <div className="p-0">
                        {viewMode === 'list' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#f8fafc] text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Manager Name</th>
                                            <th className="px-6 py-4">Manager Email</th>
                                            <th className="px-6 py-4">Sales Executive</th>
                                            <th className="px-6 py-4">Sales Email</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedAssignments.length > 0 ? paginatedAssignments.map((assignment) => (
                                            <tr key={assignment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs font-mono">
                                                        {assignment.managerName.charAt(0)}
                                                    </div>
                                                    {assignment.managerName}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 italic text-xs">
                                                    {assignment.managerEmail}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                                                    {assignment.salesName}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 italic text-xs">
                                                    {assignment.salesEmail}
                                                </td>
                                                <td className="px-6 py-4 flex items-center justify-center gap-3">
                                                    <button onClick={() => handleEdit(assignment)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Reassign">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(assignment.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" title="Delete Assignment">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500 font-medium">No team assignments found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                {Object.keys(groupedAssignments).length > 0 ? Object.keys(groupedAssignments).map(managerName => (
                                    <div key={managerName} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                                        <div className="bg-[#f8fafc] px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    {managerName.charAt(0)}
                                                </div>
                                                <h3 className="font-bold text-gray-800 text-sm">Manager: {managerName}</h3>
                                            </div>
                                            <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{groupedAssignments[managerName].length} Members</span>
                                        </div>
                                        <div className="bg-white">
                                            {groupedAssignments[managerName].map((assignment, index) => (
                                                <div key={assignment.id} className={`flex items-center justify-between px-6 py-3 ${index < groupedAssignments[managerName].length - 1 ? 'border-b border-gray-50' : ''}`}>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-700">{assignment.salesName}</span>
                                                        <span className="text-[10px] text-gray-400 italic">Sales Ex: {assignment.salesEmail}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => handleEdit(assignment)} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition" title="Reassign">
                                                            <Edit size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(assignment.id)} className="p-1 text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-gray-500 font-medium py-8 border border-gray-100 rounded-lg">No teams to display.</div>
                                )}
                            </div>
                        )}
                        {/* Pagination Controls */}
                        {viewMode === 'list' && (
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 mt-4 rounded-b-lg">
                                <span className="text-sm text-gray-500">
                                    Showing <span className="font-semibold text-gray-700">{filteredAssignments.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAssignments.length)}</span> of <span className="font-semibold text-gray-700">{filteredAssignments.length}</span> entries
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

            </div>
        </CRMLayout>
    );
};

export default TeamManagement;
