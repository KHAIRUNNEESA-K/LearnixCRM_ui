import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { UserPlus, Users, Trash2, Edit, Search, Plus, UserMinus, X, Mail, Phone, BookOpen, Share2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const LeadAssign = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([
        { id: 111, name: 'Robert Fox', email: 'robert@fox.com', phone: '9207769041', courseInterested: 'Full Stack', source: 'Google', salesEmail: 'sales@learnix.com', managerEmail: 'manager@learnix.com' },
        { id: 222, name: 'Jane Cooper', email: 'jane@cooper.net', phone: '9876543210', courseInterested: 'Data Science', source: 'LinkedIn', salesEmail: 'johndoe@learnix.com', managerEmail: 'manager@learnix.com' },
        { id: 333, name: 'Cody Fisher', email: 'cody@fisher.io', phone: '8877665544', courseInterested: 'UI/UX', source: 'Instagram', salesEmail: null, managerEmail: 'manager@learnix.com' },
        { id: 444, name: 'Esther Howard', email: 'esther@howard.org', phone: '7766554433', courseInterested: 'Digital Marketing', source: 'Facebook', salesEmail: 'sales@learnix.com', managerEmail: 'manager@learnix.com' }
    ]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState('');
    const [leadName, setLeadName] = useState('');
    const [selectedSales, setSelectedSales] = useState('');
    const [salesName, setSalesName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Modal state for registration
    const [createModal, setCreateModal] = useState({
        open: false, fullname: '', email: '', phone: '', courseInterested: '', source: ''
    });

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

            // Filter sales executives for this manager
            const salesAgents = usersData.filter(u => u.role === 'Sales' && u.managerEmail === user?.email);
            setTeamMembers(salesAgents);

            // Filter leads for this manager
            const managerLeads = leadsData.filter(l => l.managerEmail === user?.email);
            // Combine with dummy data but avoid duplicates
            setLeads(prev => {
                const existingEmails = new Set(prev.map(l => l.email));
                const newLeads = managerLeads.filter(l => !existingEmails.has(l.email));
                return [...prev, ...newLeads];
            });
        } catch (error) {
            toast.error("Failed to load data", { toastId: 'load-error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleAssign = async (e) => {
        e.preventDefault();

        let targetLeadId = selectedLead;
        if (!targetLeadId && leadName) {
            const found = leads.find(l => l.name.toLowerCase() === leadName.toLowerCase());
            if (found) targetLeadId = found.id;
        }

        let targetSalesEmail = selectedSales;
        if (!targetSalesEmail && salesName) {
            const found = teamMembers.find(s => s.name.toLowerCase() === salesName.toLowerCase());
            if (found) targetSalesEmail = found.email;
        }

        if (!targetLeadId || !targetSalesEmail) {
            toast.warn("Please enter a valid lead name and a valid sales agent name from your team.");
            return;
        }

        try {
            await api.leads.assign(targetLeadId, targetSalesEmail);
            toast.success(editMode ? 'Assignment updated successfully' : 'Lead assigned successfully', { toastId: 'assign-success' });

            // Update local state
            setLeads(leads.map(l => l.id === targetLeadId ? { ...l, salesEmail: targetSalesEmail } : l));

            setEditMode(false);
            setSelectedLead('');
            setLeadName('');
            setSelectedSales('');
            setSalesName('');
        } catch (error) {
            toast.error("Assignment failed", { toastId: 'assign-error' });
        }
    };

    const handleEdit = (lead) => {
        setEditMode(true);
        setSelectedLead(lead.id);
        setLeadName(lead.name);
        setSelectedSales(lead.salesEmail || '');
        const agent = teamMembers.find(t => t.email === lead.salesEmail);
        setSalesName(agent ? agent.name : (lead.salesEmail || ''));
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead record permanently?")) return;
        try {
            await api.leads.delete(id);
            setLeads(leads.filter(l => l.id !== id));
            toast.info('Lead record removed', { toastId: 'delete-success' });
        } catch (error) {
            toast.error("Delete failed", { toastId: 'delete-error' });
        }
    };

    const handleRemoveAssignment = async (id) => {
        if (!window.confirm("Remove current sales assignment?")) return;
        try {
            await api.leads.removeAssignment(id);
            setLeads(leads.map(l => l.id === id ? { ...l, salesEmail: null } : l));
            toast.info("Assignment removed", { toastId: 'remove-assign-success' });
        } catch (error) {
            toast.error("Operation failed", { toastId: 'remove-assign-error' });
        }
    };

    const handleCreateLead = async (e) => {
        e.preventDefault();
        try {
            // Note: Transferring fullname to name and courseInterested to course for API compatibility if needed, 
            // but the request asks for these specific names in the page.
            const res = await api.leads.create({
                ...createModal,
                // If API expects 'name' and 'course', we map them here, 
                // but since mock spreads it, it will just have new keys.
                name: createModal.fullname,
                course: createModal.courseInterested,
                managerEmail: user?.email,
                value: '₹0'
            });
            if (res.success) {
                toast.success("New lead registered successfully", { toastId: 'create-success' });
                setLeads([res.lead, ...leads]);
                setCreateModal({ open: false, fullname: '', email: '', phone: '', courseInterested: '', source: '' });
            }
        } catch (error) {
            toast.error("Registration failed", { toastId: 'create-error' });
        }
    };

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.salesEmail && l.salesEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    );



    const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1;
    const paginatedLeads = filteredLeads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <CRMLayout role="Manager" title="Assign Lead">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Assignment Form & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden text-sm">
                        <div className="px-6 py-4 border-b border-gray-100 bg-[#f8fafc]">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <UserPlus size={18} className="text-[#3c72d1]" />
                                {editMode ? 'Reassign Lead' : 'Assign Lead to Sales'}
                            </h2>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAssign} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Enter Lead Name</label>
                                    <div className="relative">
                                        <input
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3c72d1] focus:border-[#3c72d1] outline-none"
                                            value={leadName}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setLeadName(val);
                                                const found = leads.find(l => l.name.toLowerCase() === val.toLowerCase());
                                                setSelectedLead(found ? found.id : '');
                                            }}
                                            placeholder="Type lead name..."
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Enter Sales Name</label>
                                    <div className="relative">
                                        <input
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3c72d1] focus:border-[#3c72d1] outline-none"
                                            value={salesName}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setSalesName(val);
                                                const found = teamMembers.find(s => s.name.toLowerCase() === val.toLowerCase());
                                                setSelectedSales(found ? found.email : '');
                                            }}
                                            placeholder="Type sales name..."
                                            required
                                        />
                                    </div>
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
                                            onClick={() => { setEditMode(false); setSelectedLead(''); setLeadName(''); setSelectedSales(''); setSalesName(''); }}
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
                        <h3 className="text-4xl font-black mb-2">{leads.length}</h3>
                        <p className="font-semibold text-blue-100 uppercase tracking-widest text-xs text-center">Total Registered Leads</p>
                        <button
                            onClick={() => setCreateModal({ ...createModal, open: true })}
                            className="mt-4 bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-6 rounded-full flex items-center gap-2 transition-all border border-white/30"
                        >
                            <Plus size={14} /> Register New Lead
                        </button>
                    </div>
                </div>

                {/* Lead Assignments Viewer */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Lead Roster</h2>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search leads or agents..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-0">
                        {loading ? (
                            <div className="py-20 text-center text-gray-500 font-medium">Loading leads...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#f8fafc] text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Lead Name</th>
                                            <th className="px-6 py-4">Lead Email</th>
                                            <th className="px-6 py-4">Assigned Sales Agent</th>
                                            <th className="px-6 py-4">Agent Email</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedLeads.length > 0 ? paginatedLeads.map((lead) => {
                                            const agent = teamMembers.find(t => t.email === lead.salesEmail);
                                            const agentName = agent ? agent.name : (lead.salesEmail ? lead.salesEmail.split('@')[0] : null);

                                            return (
                                                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                            {lead.name.charAt(0)}
                                                        </div>
                                                        {lead.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 italic text-xs">
                                                        {lead.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap text-xs">
                                                        {agentName ? agentName : <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider bg-orange-50 px-2 py-1 rounded">Unassigned</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 italic text-[10px]">
                                                        {lead.salesEmail || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 flex items-center justify-center gap-3">
                                                        <button onClick={() => handleEdit(lead)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Reassign">
                                                            <Edit size={16} />
                                                        </button>
                                                        {lead.salesEmail && (
                                                            <button onClick={() => handleRemoveAssignment(lead.id)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition" title="Remove Assignment">
                                                                <UserMinus size={16} />
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDelete(lead.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" title="Delete Lead">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-medium">No leads found.</td>
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
                                    Showing <span className="font-semibold text-gray-700">{filteredLeads.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)}</span> of <span className="font-semibold text-gray-700">{filteredLeads.length}</span> entries
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

            {/* Modal: Register Lead */}
            {createModal.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-[#f8fafc]">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Plus size={20} className="text-[#3c72d1]" />
                                Register New Lead
                            </h3>
                            <button onClick={() => setCreateModal({ ...createModal, open: false })} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateLead} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative">
                                    <input required type="text" placeholder="John Doe" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-[#3c72d1] focus:bg-white rounded-md text-sm outline-none transition-all" value={createModal.fullname} onChange={(e) => setCreateModal({ ...createModal, fullname: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative">
                                    <input required type="email" placeholder="john@example.com" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-[#3c72d1] focus:bg-white rounded-md text-sm outline-none transition-all" value={createModal.email} onChange={(e) => setCreateModal({ ...createModal, email: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                                <div className="relative">
                                    <input required type="text" placeholder="+1..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-[#3c72d1] focus:bg-white rounded-md text-sm outline-none transition-all" value={createModal.phone} onChange={(e) => setCreateModal({ ...createModal, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Course Interested</label>
                                <div className="relative">
                                    <input required type="text" placeholder="Full Stack Development" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-[#3c72d1] focus:bg-white rounded-md text-sm outline-none transition-all" value={createModal.courseInterested} onChange={(e) => setCreateModal({ ...createModal, courseInterested: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Source</label>
                                <div className="relative">
                                    <input required type="text" placeholder="LinkedIn, Google, etc." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-[#3c72d1] focus:bg-white rounded-md text-sm outline-none transition-all" value={createModal.source} onChange={(e) => setCreateModal({ ...createModal, source: e.target.value })} />
                                </div>
                            </div>
                            <div className="md:col-span-2 pt-4">
                                <button type="submit" className="w-full py-3 bg-[#3c72d1] text-white rounded-md text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md">
                                    Confirm Registration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CRMLayout>
    );
};

export default LeadAssign;

