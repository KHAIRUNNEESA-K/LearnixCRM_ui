import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { Search, Trash2, Ban, Unlock, CheckCircle, XCircle, Info, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState({});
    const ITEMS_PER_PAGE = 5;
    const { user } = useAuth();


    // Reset page to 1 on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRole, filterStatus]);

    useEffect(() => {
        loadUsers();
    }, [filterStatus, filterRole]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            let data;
            if (filterRole === 'Manager') {
                data = await api.users.getManagers();
            } else if (filterRole === 'Sales') {
                data = await api.users.getSales();
            } else if (filterStatus === 'Active') {
                data = await api.users.getActive();
            } else if (filterStatus === 'Pending') {
                data = await api.users.getPending();
            } else if (filterStatus === 'Approve') {
                data = await api.users.getApproved();
            } else if (filterStatus === 'Block') {
                data = await api.users.getBlocked();
            } else if (filterStatus === 'Rejected') {
                data = await api.users.getRejected();
            } else if (filterStatus === 'Inactive') {
                data = await api.users.getInactive();
            } else {
                data = await api.users.getAll();
            }
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        const confirmToast = ({ closeToast }) => (
            <div className="flex flex-col gap-3 p-1">
                <p className="text-sm font-semibold text-slate-800">Are you sure you want to delete this user?</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={closeToast}
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            closeToast();
                            try {
                                await api.users.delete(id);
                                setUsers(users.filter(u => u.id !== id));
                                toast.success('User deleted successfully', { toastId: 'user-delete' });
                            } catch (error) {
                                console.error('Failed to delete user:', error);
                                toast.error('Failed to delete user', { toastId: 'user-delete' });
                            }
                        }}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors"
                    >
                        Ok
                    </button>
                </div>
            </div>
        );

        toast.info(confirmToast, {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false,
            toastId: `confirm-delete-${id}`
        });
    };

    const handleToggleBlock = async (id, currentStatus) => {
        const isBlocking = currentStatus !== 'Block';

        if (isBlocking && currentStatus !== 'Active') {
            toast.error('Failed to block user. Only active users can be blocked', {
                toastId: `user-status-${id}`,
                autoClose: 3000
            });
            return;
        }

        setActionLoading(prev => ({ ...prev, [id]: true }));
        const newStatus = isBlocking ? 'Block' : 'Active';

        try {
            if (isBlocking) {
                await api.users.block(id);
            } else {
                await api.users.unblock(id);
            }

            toast.success(`User ${isBlocking ? 'blocked' : 'unblocked'} successfully`, {
                toastId: `user-status-${id}`,
                autoClose: 2000
            });

            // Wait for toast to complete (2 seconds) before updating icon and re-enabling
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update UI after success
            setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        } catch (error) {
            console.error('Failed to update user status:', error);
            toast.error(`Failed to ${isBlocking ? 'block' : 'unblock'} user`, {
                toastId: `user-status-${id}`,
                autoClose: 2000
            });
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.users.approve(id);
            toast.success(`User approved successfully`, { toastId: 'user-approve' });
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
                await api.users.reject(id, reason);
                setUsers(users.map(u => u.id === id ? { ...u, status: 'Rejected', rejectionReason: reason } : u));
                toast.success('User rejected successfully', { toastId: 'user-reject' });
            } catch (error) {
                console.error('Failed to reject user:', error);
                toast.error('Failed to reject user', { toastId: 'user-reject' });
            }
        }
    };

    const handleViewUser = async (user) => {
        try {
            const userDetails = await api.users.getById(user.id);
            setSelectedUser(userDetails);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            toast.error('Failed to fetch user details');
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



    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <CRMLayout role={user?.role || "Admin"} title="User Management">

            <div className="card text-sm">
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
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border text-sm text-text-muted pb-3">
                                    <th className="font-semibold py-3 px-4 text-center">User</th>
                                    <th className="font-semibold px-4 text-center whitespace-nowrap">Emp Code</th>
                                    <th className="font-semibold px-4 text-center">Email</th>
                                    <th className="font-semibold px-4 hidden sm:table-cell text-center">Phone</th>
                                    <th className="font-semibold px-4 text-center">Role</th>
                                    <th className="font-semibold px-4 text-center">Status</th>
                                    <th className="font-semibold px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.id} className="border-b border-border hover:bg-black/5 transition-colors">
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3 text-left">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                    {user.profileImage ? (
                                                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-[10px] font-black text-slate-400 uppercase">{user.name.split(' ').map(n => n[0]).join('')}</span>
                                                    )}
                                                </div>
                                                <span className="font-bold text-slate-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 font-mono text-xs font-bold text-slate-500 uppercase tracking-tighter text-center">
                                            {user.employeeCode || '---'}
                                        </td>
                                        <td className="px-4 text-text-muted text-xs font-medium text-center">{user.email}</td>
                                        <td className="px-4 text-text-muted hidden sm:table-cell text-xs font-medium text-center">{user.phonenumber || 'N/A'}</td>

                                        <td className="px-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight inline-block ${user.role === 'Admin' ? 'bg-primary/10 text-primary' :
                                                user.role === 'Manager' ? 'bg-indigo-50 text-indigo-600' :
                                                    'bg-purple-50 text-purple-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight ${getStatusStyle(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>

                                        <td className="px-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 p-2 transition-colors"
                                                    title="View Details"
                                                    onClick={() => handleViewUser(user)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {user.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            className="text-emerald-500 hover:text-emerald-700 p-2 transition-colors"
                                                            title="Approve User"
                                                            onClick={() => handleApprove(user.id)}
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                                                            title="Reject User"
                                                            onClick={() => handleReject(user.id)}
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    className={`${user.status === 'Block' ? 'text-emerald-600 hover:text-emerald-700' : 'text-orange-500 hover:text-orange-600'} p-2 transition-colors ${actionLoading[user.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    title={user.status === 'Block' ? 'Unblock User' : 'Block User'}
                                                    onClick={() => handleToggleBlock(user.id, user.status)}
                                                    disabled={actionLoading[user.id]}
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-6 text-text-muted">No users found matching your search.</td>
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
                                className={`px-2 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                            >
                                <ChevronLeft size={18} />
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
                                className={`px-2 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === totalPages ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-3 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">User Details</h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5">
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden mb-2">
                                    {selectedUser.profileImage ? (
                                        <img src={selectedUser.profileImage} alt={selectedUser.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-black text-slate-400 uppercase">
                                            {selectedUser.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-xl font-bold text-slate-800">{selectedUser.name}</h4>
                                <p className="text-sm text-slate-500 font-medium">{selectedUser.role}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-2">
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee Code</div>
                                    <div className="text-sm font-bold text-slate-700 text-right font-mono">{selectedUser.employeeCode || '---'}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-2">
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</div>
                                    <div className="text-sm font-medium text-slate-700 text-right truncate" title={selectedUser.email}>{selectedUser.email}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-2">
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</div>
                                    <div className="text-sm font-medium text-slate-700 text-right">{selectedUser.phonenumber || 'N/A'}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-2">
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</div>
                                    <div className="text-right">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight ${getStatusStyle(selectedUser.status)}`}>
                                            {selectedUser.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-2">
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined Date</div>
                                    <div className="text-sm font-medium text-slate-700 text-right">{formatDate(selectedUser.joiningDate)}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-1">
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reject Reason</div>
                                    <div className="text-sm font-medium text-slate-700 text-right italic leading-tight">
                                        {selectedUser.rejectionReason || '---'}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-full mt-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl transition-all duration-200"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CRMLayout>
    );
};

export default UserManagement;
