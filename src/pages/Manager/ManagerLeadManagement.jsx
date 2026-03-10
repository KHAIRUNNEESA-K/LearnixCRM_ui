import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const ManagerLeadManagement = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([
        { id: 'D1', name: 'Robert Fox', email: 'robert@fox.com', phone: '9207769041', course: 'Full Stack', source: 'Google', salesEmail: 'sid@learnix.com', managerEmail: user?.email || 'manager@learnix.com', status: 'New' },
        { id: 'D2', name: 'Jane Cooper', email: 'jane@cooper.net', phone: '9876543210', course: 'Data Science', source: 'LinkedIn', salesEmail: 'john.d@learnix.com', managerEmail: user?.email || 'manager@learnix.com', status: 'Contacted' },
        { id: 'D3', name: 'Cody Fisher', email: 'cody@fisher.io', phone: '8877665544', course: 'UI/UX Design', source: 'Instagram', salesEmail: null, managerEmail: user?.email || 'manager@learnix.com', status: 'Qualified' },
        { id: 'D4', name: 'Esther Howard', email: 'esther@howard.org', phone: '7766554433', course: 'Digital Marketing', source: 'Facebook', salesEmail: 'sid@learnix.com', managerEmail: user?.email || 'manager@learnix.com', status: 'Converted' },
        { id: 'D5', name: 'Cameron Williamson', email: 'cam@will.com', phone: '6655443322', course: 'Cyber Security', source: 'Search', salesEmail: 'john.d@learnix.com', managerEmail: user?.email || 'manager@learnix.com', status: 'New' },
        { id: 'D6', name: 'Brooklyn Simmons', email: 'brook@simm.com', phone: '9988776655', course: 'Full Stack', source: 'Google Ads', salesEmail: 'sid@learnix.com', managerEmail: user?.email || 'manager@learnix.com', status: 'Contacted' },
        { id: 'D7', name: 'Guy Hawkins', email: 'guy@hawk.com', phone: '8877665544', course: 'Data Science', source: 'Direct', salesEmail: null, managerEmail: user?.email || 'manager@learnix.com', status: 'Qualified' },
        { id: 'D8', name: 'Theresa Webb', email: 'theresa@webb.com', phone: '7766554433', course: 'UI/UX Design', source: 'Referral', salesEmail: 'john.d@learnix.com', managerEmail: user?.email || 'manager@learnix.com', status: 'Negotiation' }
    ]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [leadsData, usersData] = await Promise.all([
                api.leads.getAll(),
                api.users.getAll()
            ]);

            // Filter leads for this manager
            // Show dummy/standard data if user is a manager or if no real leads match yet
            const isManager = user?.role === 'Manager' || user?.email?.includes('manager') || !user;
            const fetchedLeads = leadsData.filter(l => l.managerEmail === user?.email);

            // Merge dummy data with fetched data, avoiding duplicates if any
            setLeads(prev => {
                const existingEmails = new Set(fetchedLeads.map(l => l.email));
                const filteredDummy = prev.filter(d => d.id.startsWith('D') && !existingEmails.has(d.email));

                // If we have a manager but no fetched leads, ensure dummy leads have the right managerEmail for display logic if needed
                const dummyWithEmail = filteredDummy.map(d => ({
                    ...d,
                    managerEmail: user?.email || d.managerEmail
                }));

                return [...dummyWithEmail, ...fetchedLeads];
            });

            // Filter sales executives for this manager
            setTeamMembers(usersData.filter(u => u.role === 'Sales' && u.managerEmail === user?.email));
        } catch (error) {
            console.error("Failed to load data", error);
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            (lead.name || lead.fullname || lead.client || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.phone || '').includes(searchTerm);
        const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
        return matchesSearch && matchesStatus;
    });


    const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1;
    const paginatedLeads = filteredLeads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <CRMLayout role="Manager" title="Lead Management">
            <div className="max-w-6xl mx-auto space-y-6 pb-12">

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Team Leads</p>
                        <p className="text-3xl font-bold text-gray-800">{leads.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-1">Assigned Leads</p>
                        <p className="text-3xl font-bold text-blue-600">{leads.filter(l => l.salesEmail).length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-1">Unassigned Leads</p>
                        <p className="text-3xl font-bold text-orange-500">{leads.filter(l => !l.salesEmail).length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Team Leads</h2>
                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 text-gray-700 bg-white"
                            >
                                <option value="All">All Statuses</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Converted">Converted</option>
                                <option value="Lost">Lost</option>
                            </select>
                            <div className="relative flex-1 md:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search leads..."
                                    className="w-full md:w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Contact Info</th>
                                        <th className="px-6 py-4">Source</th>
                                        <th className="px-6 py-4">Course</th>
                                        <th className="px-6 py-4">Assigned Agent</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {paginatedLeads.length > 0 ? (
                                        paginatedLeads.map((lead) => (
                                            <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-800">
                                                    {lead.name || lead.fullname || lead.client}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-900">{lead.phone}</div>
                                                    <div className="text-gray-500 text-xs">{lead.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{lead.source}</td>
                                                <td className="px-6 py-4 text-gray-600">{lead.course || lead.courseInterested}</td>
                                                <td className="px-6 py-4">
                                                    {lead.salesEmail ? (
                                                        <span className="text-blue-600 font-medium">{lead.salesEmail.split('@')[0]}</span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                        ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                            lead.status === 'Contacted' ? 'bg-amber-100 text-amber-700' :
                                                                lead.status === 'Qualified' ? 'bg-emerald-100 text-emerald-700' :
                                                                    lead.status === 'Converted' ? 'bg-teal-100 text-teal-700' :
                                                                        'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {lead.status || 'New'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center text-gray-500 font-medium">
                                                No leads found for your team.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{filteredLeads.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)}</span> of <span className="font-semibold text-gray-700">{filteredLeads.length}</span> entries
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === i + 1 ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

export default ManagerLeadManagement;
