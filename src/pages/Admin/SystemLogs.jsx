import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { Activity, LogIn, Search, Filter, Download, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const activityLogsData = [
    { id: 'ACT-001', timestamp: '2026-02-27 09:30:15', user: 'Admin User', role: 'Admin', action: 'Created User', resource: 'User ID: 1045', status: 'Success', ip: '192.168.1.105' },
    { id: 'ACT-002', timestamp: '2026-02-27 09:15:22', user: 'Jane Doe', role: 'Manager', action: 'Updated Lead Status', resource: 'Lead ID: L-992', status: 'Success', ip: '192.168.1.142' },
    { id: 'ACT-003', timestamp: '2026-02-27 08:45:10', user: 'John Smith', role: 'Sales Executive', action: 'Exported Data', resource: 'Sales Report Q1', status: 'Failed', ip: '192.168.1.118' },
    { id: 'ACT-004', timestamp: '2026-02-26 16:20:05', user: 'Admin User', role: 'Admin', action: 'Deleted Record', resource: 'Team: Beta', status: 'Success', ip: '192.168.1.105' },
    { id: 'ACT-005', timestamp: '2026-02-26 14:10:45', user: 'Sarah Connor', role: 'Manager', action: 'Assigned Lead', resource: 'Lead ID: L-884 -> John Smith', status: 'Success', ip: '192.168.1.166' },
    { id: 'ACT-006', timestamp: '2026-02-26 11:05:33', user: 'System', role: 'System', action: 'Automated Backup', resource: 'Database', status: 'Success', ip: 'localhost' },
    { id: 'ACT-007', timestamp: '2026-02-26 09:12:18', user: 'John Smith', role: 'Sales Executive', action: 'Created Note', resource: 'Lead ID: L-992', status: 'Success', ip: '192.168.1.118' },
    { id: 'ACT-008', timestamp: '2026-02-25 10:14:15', user: 'Admin User', role: 'Admin', action: 'Modified Role', resource: 'User ID: 1011', status: 'Success', ip: '192.168.1.105' },
    { id: 'ACT-009', timestamp: '2026-02-25 08:33:10', user: 'Jane Doe', role: 'Manager', action: 'Exported Leads', resource: 'Qualified Leads', status: 'Failed', ip: '192.168.1.142' },
    { id: 'ACT-010', timestamp: '2026-02-24 14:15:00', user: 'Admin User', role: 'Admin', action: 'Updated Settings', resource: 'Email Server', status: 'Success', ip: '192.168.1.105' },
    { id: 'ACT-011', timestamp: '2026-02-24 12:10:00', user: 'System', role: 'System', action: 'Data Indexing', resource: 'ElasticSearch', status: 'Success', ip: 'localhost' },
    { id: 'ACT-012', timestamp: '2026-02-24 10:05:00', user: 'Sarah Connor', role: 'Manager', action: 'Modified Team', resource: 'Team Alpha', status: 'Success', ip: '192.168.1.166' },
];

const loginHistoryData = [
    { id: 'LOG-001', timestamp: '2026-02-27 09:00:12', user: 'Admin User', role: 'Admin', status: 'Success', ip: '192.168.1.105', device: 'Chrome / Windows 11' },
    { id: 'LOG-002', timestamp: '2026-02-27 08:55:40', user: 'Jane Doe', role: 'Manager', status: 'Success', ip: '192.168.1.142', device: 'Safari / macOS' },
    { id: 'LOG-003', timestamp: '2026-02-27 08:40:05', user: 'John Smith', role: 'Sales Executive', status: 'Success', ip: '192.168.1.118', device: 'Chrome / Windows 10' },
    { id: 'LOG-004', timestamp: '2026-02-27 08:35:22', user: 'Unknown', role: 'N/A', status: 'Failed', ip: '45.22.109.11', device: 'Firefox / Linux' },
    { id: 'LOG-005', timestamp: '2026-02-26 18:05:15', user: 'Sarah Connor', role: 'Manager', status: 'Success', ip: '192.168.1.166', device: 'Edge / Windows 11' },
    { id: 'LOG-006', timestamp: '2026-02-26 17:30:45', user: 'Admin User', role: 'Admin', status: 'Success', ip: '192.168.1.105', device: 'Chrome / Windows 11' },
    { id: 'LOG-007', timestamp: '2026-02-26 08:55:10', user: 'admin@mail.com', role: 'N/A', status: 'Failed', ip: '192.168.1.105', device: 'Chrome / Windows 11' },
    { id: 'LOG-008', timestamp: '2026-02-25 14:20:15', user: 'John Smith', role: 'Sales Executive', status: 'Success', ip: '192.168.1.118', device: 'Chrome / Windows 10' },
    { id: 'LOG-009', timestamp: '2026-02-25 09:10:00', user: 'Jane Doe', role: 'Manager', status: 'Success', ip: '192.168.1.142', device: 'Safari / macOS' },
    { id: 'LOG-010', timestamp: '2026-02-25 08:00:00', user: 'System', role: 'System', status: 'Success', ip: '127.0.0.1', device: 'CRON Job' },
    { id: 'LOG-011', timestamp: '2026-02-24 19:30:00', user: 'Sarah Connor', role: 'Manager', status: 'Success', ip: '192.168.1.166', device: 'Mobile / Android' },
];

const SystemLogs = () => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('activity'); // 'activity' or 'login'
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const { user } = useAuth();


    // Reset page to 1 when tab, search, or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm, filterStatus]);

    const getStatusIcon = (status) => {
        if (status === 'Success') return <CheckCircle2 size={16} className="text-emerald-500" />;
        if (status === 'Failed') return <XCircle size={16} className="text-red-500" />;
        return <AlertCircle size={16} className="text-amber-500" />;
    };

    const getStatusBadge = (status) => {
        if (status === 'Success') {
            return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">{getStatusIcon(status)} Success</span>;
        }
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">{getStatusIcon(status)} Failed</span>;
    };

    // Data Filtering logic encompassing both Search text and Status Filter Menu
    const processData = (sourceData) => {
        return sourceData.filter(log => {
            const matchesSearch =
                log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (log.resource && log.resource.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (log.device && log.device.toLowerCase().includes(searchTerm.toLowerCase())) ||
                log.ip.includes(searchTerm);

            const matchesFilter = filterStatus === 'All' || log.status === filterStatus;

            return matchesSearch && matchesFilter;
        });
    };

    const activeData = processData(activeTab === 'activity' ? activityLogsData : loginHistoryData);
    const totalPages = Math.ceil(activeData.length / ITEMS_PER_PAGE) || 1;
    const paginatedData = activeData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleExport = () => {
        if (activeData.length === 0) return;

        const isActivity = activeTab === 'activity';
        const headers = isActivity ?
            ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Resource Affected', 'Status', 'IP Address'] :
            ['ID', 'Timestamp', 'User', 'Role', 'Device Interface', 'Status', 'IP Address'];

        const csvRows = [];
        csvRows.push(headers.join(',')); // Push top headers

        activeData.forEach(row => {
            const values = isActivity ?
                [row.id, row.timestamp, row.user, row.role, row.action, row.resource, row.status, row.ip] :
                [row.id, row.timestamp, row.user, row.role, row.device, row.status, row.ip];

            // Map values with string wrap to prevent corruption from spaces/commas inside content
            const escaped = values.map(val => `"${val}"`);
            csvRows.push(escaped.join(','));
        });

        // Create Blob binary
        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });

        // Trigger generic web-download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTab}_logs_export.csv`;
        document.body.appendChild(a);
        a.click();

        // Cleanup element and data-bind
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(`${activeTab === 'activity' ? 'Activity' : 'Login'} logs exported successfully!`, { toastId: 'logs-export' });
    };

    return (
        <CRMLayout role="Admin" title="System Logs">

            <div className="max-w-7xl mx-auto pb-2">

                {/* Tabs & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <button
                            onClick={() => { setActiveTab('activity'); setFilterStatus('All'); setSearchTerm(''); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-colors duration-200 ${activeTab === 'activity' ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Activity size={18} />
                            Activity Logs
                        </button>
                        <button
                            onClick={() => { setActiveTab('login'); setFilterStatus('All'); setSearchTerm(''); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-colors duration-200 ${activeTab === 'login' ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <LogIn size={18} />
                            Login History
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab === 'activity' ? 'activities' : 'logins'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            />
                        </div>

                        {/* Dropdown Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <Filter size={16} /> Filter{filterStatus !== 'All' ? `: ${filterStatus}` : ''}
                            </button>
                            {filterOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                                    <button
                                        onClick={() => { setFilterStatus('All'); setFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterStatus === 'All' ? 'font-bold text-gray-900 border-l-2 border-blue-500' : 'text-gray-700'}`}
                                    >
                                        All Status
                                    </button>
                                    <button
                                        onClick={() => { setFilterStatus('Success'); setFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterStatus === 'Success' ? 'font-bold text-gray-900 border-l-2 border-green-500' : 'text-gray-700'}`}
                                    >
                                        Success
                                    </button>
                                    <button
                                        onClick={() => { setFilterStatus('Failed'); setFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterStatus === 'Failed' ? 'font-bold text-gray-900 border-l-2 border-red-500' : 'text-gray-700'}`}
                                    >
                                        Failed
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Export Trigger */}
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>

                {/* Table Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto min-h-[390px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                    {activeTab === 'activity' ? (
                                        <>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Resource Affected</th>
                                        </>
                                    ) : (
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Device & Browser</th>
                                    )}
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">IP Address</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{log.timestamp}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-800">{log.user}</span>
                                                    <span className="text-xs text-gray-500">{log.role}</span>
                                                </div>
                                            </td>
                                            {activeTab === 'activity' ? (
                                                <>
                                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{log.action}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{log.resource}</td>
                                                </>
                                            ) : (
                                                <td className="px-6 py-4 text-sm text-gray-600">{log.device}</td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{log.ip}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(log.status)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={activeTab === 'activity' ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                                            No logs found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Working Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{activeData.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, activeData.length)}</span> of <span className="font-semibold text-gray-700">{activeData.length}</span> entries
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
                </div>

            </div>
        </CRMLayout>
    );
};

export default SystemLogs;
