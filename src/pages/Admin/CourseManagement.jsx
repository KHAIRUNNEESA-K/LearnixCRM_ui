import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { Plus, Search, Edit, Trash2, BookOpen, Clock, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const CourseManagement = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        duration: '',
        price: '',
        status: 'Active'
    });

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const data = await api.courses.getAll();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            // Parse duration back to numeric for the input (e.g. "6 Months" -> 6)
            const numericDuration = course.duration ? course.duration.split(' ')[0] : '';
            // Strip formatting from price for the numeric input if needed
            const numericPrice = course.price ? course.price.replace(/,/g, '') : '';

            setFormData({
                name: course.name,
                duration: numericDuration,
                price: numericPrice,
                status: course.status
            });
        } else {
            setEditingCourse(null);
            setFormData({
                name: '',
                duration: '',
                price: '',
                status: 'Active'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (editingCourse) {
                await api.courses.update(editingCourse.id, formData);
                toast.success('Course updated successfully');
                await loadCourses();
            } else {
                await api.courses.create(formData);
                toast.success('Course created successfully');
                await loadCourses();
            }
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save course:', error);
            toast.error(error.message || 'Failed to save course');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = (id) => {
        const confirmToast = ({ closeToast }) => (
            <div className="flex flex-col gap-3 p-1">
                <p className="text-sm font-semibold text-slate-800">Are you sure you want to delete this course? This action cannot be undone.</p>
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
                            setActionLoading(true);
                            try {
                                await api.courses.delete(id);
                                toast.success('Course deleted successfully', {
                                    toastId: 'course-delete-success',
                                    autoClose: 1500
                                });
                                await loadCourses();
                            } catch (error) {
                                console.error('Failed to delete course:', error);
                                toast.error(error.message || 'Failed to delete course');
                            } finally {
                                setActionLoading(false);
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
            toastId: `confirm-delete-course-${id}`
        });
    };

    const filteredCourses = courses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <CRMLayout role={user?.role || "Admin"} title="Course Management">
            <div className="card text-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c72d1] text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-[#3c72d1] text-white rounded-md hover:bg-blue-700 transition font-bold"
                    >
                        <Plus size={18} />
                        Add New Course
                    </button>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    {loading ? (
                        <div className="py-20 text-center font-medium text-slate-500 italic">
                            Connecting to institute records...
                        </div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border text-sm text-text-muted pb-3">
                                    <th className="font-semibold py-3 px-4 text-left">Course Name</th>
                                    <th className="font-semibold px-4 text-left">Duration</th>
                                    <th className="font-semibold px-4 text-left">Price</th>
                                    <th className="font-semibold px-4 text-center">Status</th>
                                    <th className="font-semibold px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map(course => (
                                    <tr key={course.id} className="border-b border-border hover:bg-black/5 transition-colors">
                                        <td className="py-4 px-4 font-bold text-slate-800">{course.name}</td>
                                        <td className="px-4 text-slate-600 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-slate-400" />
                                                {course.duration}
                                            </span>
                                        </td>
                                        <td className="px-4 text-slate-800 font-bold">
                                            <span className="flex items-center gap-0.5">
                                                <IndianRupee size={14} />
                                                {course.price}
                                            </span>
                                        </td>
                                        <td className="px-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight ${course.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="px-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(course)}
                                                    className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                                                    title="Edit Course"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCourses.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-slate-500 font-medium italic">No courses found on the server.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Course Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-r from-[#3c72d1] to-blue-600 px-6 py-4 flex justify-between items-center text-white">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <BookOpen size={20} />
                                {editingCourse ? 'Edit Course' : 'Add New Course'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-white/80 hover:text-white">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Course Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Flutter"
                                />
                            </div>
                            <div className="grid grid-cols-1">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50 bg-white"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Duration (Months)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        placeholder="e.g. 6"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Price (Fee)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/50"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="e.g. 390000"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className={`flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl transition-all ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 py-2.5 bg-[#3c72d1] hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={actionLoading}
                                >
                                    {actionLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                                    {editingCourse ? 'Save Changes' : 'Add Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CRMLayout>
    );
};

export default CourseManagement;
