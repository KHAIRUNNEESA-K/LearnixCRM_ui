import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { Search, Trash2, Ban, Unlock, CheckCircle, XCircle, Info } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const { user } = useAuth();


    // Reset page to 1 on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRole, filterStatus]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await api.users.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.users.delete(id);
            setUsers(users.filter(u => u.id !== id));
            toast.success('User deleted successfully', { toastId: 'user-delete' });
        } catch (error) {
            console.error('Failed to delete user:', error);
            toast.error('Failed to delete user', { toastId: 'user-delete' });
        }
    };

    const handleToggleBlock = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Block' ? 'Active' : 'Block';
        try {
            await api.users.update(id, { status: newStatus });
            setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
            toast.info(`User ${currentStatus === 'Block' ? 'unblocked' : 'blocked'} successfully`, { toastId: `user-status-${id}` });
        } catch (error) {
            console.error('Failed to update user status:', error);
            toast.error(`Failed to ${currentStatus === 'Block' ? 'unblock' : 'block'} user`, { toastId: `user-status-${id}` });
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.users.update(id, { status: 'Approve' });
            // Simulate sending a SendGrid email
            console.log(`Simulating SendGrid Email to User ID: ${id} with password reset link.`);
            toast.success(`User approved. `, { toastId: 'user-approve' });
            setUsers(users.map(u => u.id === id ? { ...u, status: 'Approve' } : u));
        } catch (error) {
            console.error('Failed to approve user:', error);
            toast.error('Failed to approve user', { toastId: 'user-approve' });
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt('Please provide a reason for rejecting this user:');
        if (reason === null) return;
        if (!reason.trim()) {
            toast.warning('A rejection reason is required.', { toastId: 'reject-warn' });
            return;
        }

        if (window.confirm(`Are you sure you want to reject this user with the following reason?\n\n"${reason}"`)) {
            try {
                await api.users.update(id, { status: 'Rejected', rejectionReason: reason });
                setUsers(users.map(u => u.id === id ? { ...u, status: 'Rejected' } : u));
                toast.success('User rejected successfully', { toastId: 'user-reject' });
            } catch (error) {
                console.error('Failed to reject user:', error);
                toast.error('Failed to reject user', { toastId: 'user-reject' });
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'approve':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'rejected':
            case 'block':
                return 'bg-red-100 text-red-700';
            case 'inactive':
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <CRMLayout role="Admin" title="User Management">

            <div className="card">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">Role:</span>
                            <select
                                className="border border-gray-300 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#3c72d1] bg-white text-gray-700 cursor-pointer shadow-sm"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="All">All Roles</option>
                                <option value="Manager">Managers</option>
                                <option value="Sales">Sales Executives</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">Status:</span>
                            <select
                                className="border border-gray-300 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#3c72d1] bg-white text-gray-700 cursor-pointer shadow-sm"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                {['All', 'Pending', 'Approve', 'Active', 'Inactive', 'Blocked', 'Rejected'].map(status => (
                                    <option key={status} value={status === 'Blocked' ? 'Block' : status}>{status === 'All' ? 'All Statuses' : status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="relative w-full xl:w-72 mt-2 xl:mt-0">
                        <input
                            type="text"
                            placeholder="Search by name or role..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1] focus:border-transparent text-sm bg-[#f8fafc] text-gray-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>

                {loading ? (
                    <div className="py-8 text-center text-text-muted">Loading users...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left border-b border-border text-sm text-text-muted pb-3">
                                    <th className="font-semibold py-3 px-4">Name</th>
                                    <th className="font-semibold px-4">Email</th>
                                    <th className="font-semibold px-4 hidden sm:table-cell">Phone Number</th>
                                    <th className="font-semibold px-4">Role</th>
                                    <th className="font-semibold px-4">Status</th>
                                    <th className="font-semibold px-4">Reason</th>
                                    <th className="font-semibold px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.id} className="border-b border-border hover:bg-black/5 transition-colors">
                                        <td className="py-4 px-4 font-medium whitespace-nowrap">{user.name}</td>
                                        <td className="px-4 text-text-muted">{user.email}</td>
                                        <td className="px-4 text-text-muted hidden sm:table-cell">{user.phonenumber || 'N/A'}</td>
                                        <td className="px-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${user.role === 'Admin' ? 'bg-primary/10 text-primary' :
                                                user.role === 'Manager' ? 'bg-secondary/10 text-secondary' :
                                                    'bg-purple-500/10 text-purple-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusStyle(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4">
                                            {user.status === 'Rejected' && user.rejectionReason && (
                                                <button
                                                    onClick={() => toast.info(`Rejection Reason: ${user.rejectionReason}`, { toastId: `reason-${user.id}` })}
                                                    className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 transition-colors"
                                                    title="View Reason"
                                                >
                                                    <Info size={16} />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">View</span>
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 text-right whitespace-nowrap">
                                            {user.status === 'Pending' && (
                                                <>
                                                    <button
                                                        className="text-emerald-500 hover:text-emerald-700 p-2 mr-1 transition-colors"
                                                        title="Approve User"
                                                        onClick={() => handleApprove(user.id)}
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 p-2 mr-1 transition-colors"
                                                        title="Reject User"
                                                        onClick={() => handleReject(user.id)}
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className={`${user.status === 'Block' ? 'text-emerald-600 hover:text-emerald-700' : 'text-orange-500 hover:text-orange-600'} p-2 mr-1 transition-colors`}
                                                title={user.status === 'Block' ? 'Unblock User' : 'Block User'}
                                                onClick={() => handleToggleBlock(user.id, user.status)}
                                            >
                                                {user.status === 'Block' ? <Unlock size={18} /> : <Ban size={18} />}
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 p-2 transition-colors"
                                                title="Delete"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-6 text-text-muted">No users found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 mt-4 rounded-b-lg">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{filteredUsers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="font-semibold text-gray-700">{filteredUsers.length}</span> entries
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
        </CRMLayout>
    );
};

export default UserManagement;
