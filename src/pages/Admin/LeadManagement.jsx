import React, { useState, useEffect } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const leadStatusData = [
    { name: 'New', value: 35 },
    { name: 'Contacted', value: 48 },
    { name: 'Qualified', value: 25 },
    { name: 'Converted', value: 18 },
    { name: 'Lost', value: 12 }
];

const LEAD_STATUS_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#14B8A6', '#EF4444'];

const mockLeads = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '9876543210', status: 'New', source: 'Website', team: 'Alpha', managerEmail: 'manager.alpha@learnix.com', salesUser: 'John Doe', salesEmail: 'john.doe@learnix.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '9123456780', status: 'Contacted', source: 'Referral', team: 'Beta', managerEmail: 'manager.beta@learnix.com', salesUser: 'Jane Smith', salesEmail: 'jane.smith@learnix.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '9988776655', status: 'Qualified', source: 'LinkedIn', team: 'Alpha', managerEmail: 'manager.alpha@learnix.com', salesUser: 'Mark Smith', salesEmail: 'mark.smith@learnix.com' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '9871234560', status: 'Converted', source: 'Website', team: 'Gamma', managerEmail: 'manager.gamma@learnix.com', salesUser: 'Sidharth', salesEmail: 'sidharth@learnix.com' },
    { id: 5, name: 'Evan Wright', email: 'evan@example.com', phone: '9122334455', status: 'Lost', source: 'Event', team: 'Beta', managerEmail: 'manager.beta@learnix.com', salesUser: 'Jane Smith', salesEmail: 'jane.smith@learnix.com' },
    { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', phone: '9988112233', status: 'New', source: 'Direct', team: 'Gamma', managerEmail: 'manager.gamma@learnix.com', salesUser: 'John Doe', salesEmail: 'john.doe@learnix.com' },
    { id: 7, name: 'George Costanza', email: 'george@example.com', phone: '8877665544', status: 'Contacted', source: 'Website', team: 'Alpha', managerEmail: 'manager.alpha@learnix.com', salesUser: 'Sidharth', salesEmail: 'sidharth@learnix.com' },
    { id: 8, name: 'Hannah Abbott', email: 'hannah@example.com', phone: '7766554433', status: 'Qualified', source: 'Referral', team: 'Beta', managerEmail: 'manager.beta@learnix.com', salesUser: 'Mark Smith', salesEmail: 'mark.smith@learnix.com' },
    { id: 9, name: 'Ian Malcolm', email: 'ian@example.com', phone: '6655443322', status: 'Converted', source: 'LinkedIn', team: 'Gamma', managerEmail: 'manager.gamma@learnix.com', salesUser: 'Jane Smith', salesEmail: 'jane.smith@learnix.com' },
    { id: 10, name: 'Jessica Jones', email: 'jessica@example.com', phone: '5544332211', status: 'Lost', source: 'Event', team: 'Alpha', managerEmail: 'manager.alpha@learnix.com', salesUser: 'John Doe', salesEmail: 'john.doe@learnix.com' },
    { id: 11, name: 'Kevin Durant', email: 'kevin@example.com', phone: '4433221100', status: 'New', source: 'Ads', team: 'Beta', managerEmail: 'manager.beta@learnix.com', salesUser: 'Sidharth', salesEmail: 'sidharth@learnix.com' },
    { id: 12, name: 'Laura Palmer', email: 'laura@example.com', phone: '3322110099', status: 'Contacted', source: 'Direct', team: 'Gamma', managerEmail: 'manager.gamma@learnix.com', salesUser: 'Mark Smith', salesEmail: 'mark.smith@learnix.com' },
    { id: 13, name: 'Michael Scott', email: 'michael@example.com', phone: '2211009988', status: 'Qualified', source: 'Website', team: 'Alpha', managerEmail: 'manager.alpha@learnix.com', salesUser: 'John Doe', salesEmail: 'john.doe@learnix.com' },
    { id: 14, name: 'Nancy Drew', email: 'nancy@example.com', phone: '1100998877', status: 'Converted', source: 'Referral', team: 'Beta', managerEmail: 'manager.beta@learnix.com', salesUser: 'Jane Smith', salesEmail: 'jane.smith@learnix.com' },
    { id: 15, name: 'Oscar Martinez', email: 'oscar@example.com', phone: '0099887766', status: 'New', source: 'LinkedIn', team: 'Gamma', managerEmail: 'manager.gamma@learnix.com', salesUser: 'Sidharth', salesEmail: 'sidharth@learnix.com' }
];

const LeadManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterTeam, setFilterTeam] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const { user } = useAuth();


    // Reset page to 1 on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus, filterTeam]);

    const filteredLeads = mockLeads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.includes(searchTerm);
        const matchesStatus = filterStatus === 'All' || lead.status.toLowerCase() === filterStatus.toLowerCase();
        const matchesTeam = filterTeam === 'All' || lead.team === filterTeam;
        return matchesSearch && matchesStatus && matchesTeam;
    });

    return (
        <CRMLayout role="Admin" title="Lead Management">

            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">All Leads</h2>
                        <div className="flex items-center gap-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 text-gray-700 bg-white"
                            >
                                <option value="All">All Statuses</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Converted">Converted</option>
                                <option value="Lost">Lost</option>
                            </select>
                            <select
                                value={filterTeam}
                                onChange={(e) => setFilterTeam(e.target.value)}
                                className="px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 text-gray-700 bg-white"
                            >
                                <option value="All">All Teams</option>
                                <option value="Alpha">Alpha Team</option>
                                <option value="Beta">Beta Team</option>
                                <option value="Gamma">Gamma Team</option>
                            </select>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search leads..."
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Source</th>
                                    <th className="px-6 py-4">Team</th>
                                    <th className="px-6 py-4">Sales User</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredLeads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((lead) => (
                                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">{lead.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{lead.email}</td>
                                        <td className="px-6 py-4 text-gray-500">{lead.phone}</td>
                                        <td className="px-6 py-4 text-gray-500">{lead.source}</td>
                                        <td className="px-6 py-4 text-gray-500 font-medium">{lead.team}</td>
                                        <td className="px-6 py-4 text-gray-500">{lead.salesUser}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold
                                                ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                    lead.status === 'Contacted' ? 'bg-amber-100 text-amber-700' :
                                                        lead.status === 'Qualified' ? 'bg-emerald-100 text-emerald-700' :
                                                            lead.status === 'Converted' ? 'bg-teal-100 text-teal-700' :
                                                                'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {lead.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 mt-4 rounded-b-lg">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{filteredLeads.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)}</span> of <span className="font-semibold text-gray-700">{filteredLeads.length}</span> entries
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                            >
                                Previous
                            </button>

                            {[...Array(Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === i + 1 ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => currentPage < Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) && setCurrentPage(currentPage + 1)}
                                disabled={currentPage === (Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1)}
                                className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
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

export default LeadManagement;
