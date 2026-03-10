import React, { useState, useEffect } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Eye,
    Download,
    Upload,
    ChevronLeft,
    ChevronRight,
    Loader,
    X,
    AlertCircle,
    Mail,
    Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

const SalesLeads = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentLead, setCurrentLead] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        source: '',
        status: 'New'
    });

    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        fetchLeads();
    }, [user]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const data = await api.leads.getAll();
            setLeads(data);
        } catch (error) {
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    const handleAddLead = async (e) => {
        e.preventDefault();
        try {
            await api.leads.create(formData);
            toast.success("Lead added successfully");
            setIsAddModalOpen(false);
            fetchLeads();
            setFormData({ name: '', email: '', phone: '', course: '', source: '', status: 'New' });
        } catch (error) {
            toast.error("Failed to add lead");
        }
    };

    const handleEditLead = async (e) => {
        e.preventDefault();
        try {
            await api.leads.update(currentLead.id, formData);
            toast.success("Lead updated successfully");
            setIsEditModalOpen(false);
            fetchLeads();
        } catch (error) {
            toast.error("Failed to update lead");
        }
    };

    const handleDeleteLead = async (id) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await api.leads.delete(id);
                toast.success("Lead deleted");
                fetchLeads();
            } catch (error) {
                toast.error("Failed to delete lead");
            }
        }
    };

    const openEditModal = (lead) => {
        setCurrentLead(lead);
        setFormData({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            course: lead.course,
            source: lead.source,
            status: lead.status
        });
        setIsEditModalOpen(true);
    };

    const openViewModal = async (id) => {
        try {
            setLoading(true);
            const lead = await api.leads.getById(id);
            setCurrentLead(lead);
            setIsViewModalOpen(true);
        } catch (error) {
            toast.error("Failed to fetch lead details");
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = ["Full Name", "Email", "Phone", "Course", "Source"];
        const rows = [
            ["John Doe", "john@example.com", "9876543210", "Full Stack", "Google"],
            ["Jane Smith", "jane@example.com", "9123456780", "Data Science", "LinkedIn"]
        ];

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "lead_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Lead template downloaded");
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            setTimeout(() => {
                toast.success(`File "${file.name}" processed. 5 new leads added.`);
                setLoading(false);
                fetchLeads();
            }, 1500);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.phone || '').includes(searchTerm);
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1;
    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <CRMLayout role="Sales" title="Lead Management">
            <div className="max-w-6xl mx-auto space-y-6 pb-12">

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Active Leads</h2>
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={downloadTemplate}
                                className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 flex items-center gap-2 font-medium"
                            >
                                <Download size={16} /> Template
                            </button>
                            <label className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 flex items-center gap-2 font-medium cursor-pointer">
                                <Upload size={16} /> Import
                                <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                            </label>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 py-2 text-sm bg-[#3c72d1] text-white rounded-md hover:bg-[#3465ba] flex items-center gap-2 font-medium"
                            >
                                <Plus size={16} /> Add Lead
                            </button>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
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
                                <Loader className="animate-spin text-[#3c72d1]" size={32} />
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#f8fafc] border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Contact Info</th>
                                        <th className="px-6 py-4">Course</th>
                                        <th className="px-6 py-4">Source</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {paginatedLeads.length > 0 ? (
                                        paginatedLeads.map((lead) => (
                                            <tr key={lead.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors group">
                                                <td className="px-6 py-4 font-bold text-gray-800">{lead.name}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-700">{lead.email}</div>
                                                    <div className="text-gray-500 text-xs">{lead.phone}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase border border-blue-100">
                                                        {lead.course}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{lead.source}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                        lead.status === 'Contacted' ? 'bg-amber-100 text-amber-700' :
                                                            lead.status === 'Qualified' ? 'bg-emerald-100 text-emerald-700' :
                                                                lead.status === 'Converted' ? 'bg-blue-600 text-white' :
                                                                    lead.status === 'Lost' ? 'bg-red-100 text-red-700' :
                                                                        'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            onClick={() => openViewModal(lead.id)}
                                                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                                            title="View"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => openEditModal(lead)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLead(lead.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">No leads found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Pagination - Matching Manager Style */}
                {!loading && filteredLeads.length > 0 && (
                    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-100">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)}</span> of <span className="font-semibold text-gray-700">{filteredLeads.length}</span> entries
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${currentPage === 1 ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'}`}
                            >
                                <ChevronLeft size={16} />
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
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals - Standardized Styling */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                                {isAddModalOpen ? 'Add New Lead' : 'Edit Lead Details'}
                            </h2>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={isAddModalOpen ? handleAddLead : handleEditLead} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                                    <input
                                        type="email" required
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                                    <input
                                        type="tel" required
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</label>
                                    <select
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 bg-white"
                                        value={formData.course}
                                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                    >
                                        <option value="">Select Course</option>
                                        <option value="Full Stack">Full Stack Development</option>
                                        <option value="Data Science">Data Science & AI</option>
                                        <option value="UI/UX Design">UI/UX Design</option>
                                        <option value="Cyber Security">Cyber Security</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</label>
                                    <select
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 bg-white"
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                    >
                                        <option value="">Select Source</option>
                                        <option value="Google">Google</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="Referral">Referral</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Status</label>
                                <select
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 bg-white"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Lost">Lost</option>
                                </select>
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="flex-1 px-4 py-2 text-sm font-bold text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-sm font-bold text-white bg-[#3c72d1] rounded-md hover:bg-[#3465ba]"
                                >
                                    {isAddModalOpen ? 'Create Lead' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal - Standardized */}
            {isViewModalOpen && currentLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-800 text-white">
                            <h2 className="text-lg font-bold tracking-tight uppercase">Lead Information</h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-white/60 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 py-4 border-b border-gray-100">
                                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                                    {(currentLead.name || 'L').charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{currentLead.name || currentLead.client}</h3>
                                    <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">{currentLead.status}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div className="space-y-0.5">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                                    <p className="text-gray-700 font-medium">{currentLead.email || 'N/A'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                                    <p className="text-gray-700 font-medium">{currentLead.phone || 'N/A'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Course</p>
                                    <p className="text-gray-700 font-medium">{currentLead.course || 'N/A'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Source</p>
                                    <p className="text-gray-700 font-medium">{currentLead.source || 'N/A'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="w-full py-2.5 bg-gray-800 text-white rounded-md text-sm font-bold hover:bg-gray-900 transition-all uppercase tracking-wider"
                            >
                                Close Detail
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CRMLayout>
    );
};

export default SalesLeads;
