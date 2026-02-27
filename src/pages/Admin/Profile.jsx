import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CRMLayout } from '../../components/CRMLayout';
import { Camera, Save, Loader, User, Mail, Phone, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: user?.firstName || user?.name?.split(' ')[0] || '',
        lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: user?.phonenumber || '',
        role: user?.role || 'Admin',
        profileImage: user?.profileImage || null
    });

    const fileInputRef = useRef(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profileImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // First Name Validation: Only letters, min 2 chars
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (!/^[A-Za-z]+$/.test(formData.firstName.trim())) {
            newErrors.firstName = 'First name should only contain letters';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        // Last Name Validation: Only letters
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (!/^[A-Za-z]+$/.test(formData.lastName.trim())) {
            newErrors.lastName = 'Last name should only contain letters';
        }

        // Phone Validation: 10 digits
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await api.profile.update(formData);
            updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phonenumber: formData.phone,
                profileImage: formData.profileImage
            });
            toast.success('Profile updated successfully!', { toastId: 'profile-update' });

            // Redirect based on role after a short delay so user can read the toast
            setTimeout(() => {
                const role = user?.role?.toLowerCase() || 'admin';
                if (role === 'admin') navigate('/admin');
                else if (role === 'manager') navigate('/manager');
                else if (role === 'sales') navigate('/sales');
                else navigate('/');
            }, 2000);

        } catch (err) {
            toast.error('Failed to update profile.', { toastId: 'profile-update' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <CRMLayout role={user?.role || "Admin"} title="My Profile">

            <div className="max-w-4xl mx-auto pb-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-[#3c72d1] to-[#63b3ed]"></div>
                    <div className="px-10 pb-10">
                        <div className="relative -mt-16 mb-8 flex items-end gap-6">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg overflow-hidden border-4 border-white">
                                    {formData.profileImage ? (
                                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-1 right-1 bg-white p-2 rounded-lg shadow-md border border-gray-100 text-[#3c72d1] hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    <Camera size={18} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <div className="pb-2">
                                <h2 className="text-2xl font-bold text-gray-800">{formData.firstName} {formData.lastName}</h2>
                                <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 uppercase tracking-wider mt-1">
                                    <Shield size={14} className="text-[#3c72d1]" /> {formData.role}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <User size={14} /> First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.firstName ? 'border-red-500' : 'border-gray-100'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/20 font-medium text-gray-700 transition-all`}
                                    placeholder="Enter first name"
                                />
                                {errors.firstName && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 ml-1 tracking-wider">{errors.firstName}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <User size={14} /> Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.lastName ? 'border-red-500' : 'border-gray-100'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/20 font-medium text-gray-700 transition-all`}
                                    placeholder="Enter last name"
                                />
                                {errors.lastName && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 ml-1 tracking-wider">{errors.lastName}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Mail size={14} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-100 rounded-lg focus:outline-none font-medium text-gray-500 transition-all cursor-not-allowed"
                                    placeholder="email@example.com"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Phone size={14} /> Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-100'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c72d1]/20 font-medium text-gray-700 transition-all`}
                                    placeholder="Enter phone number"
                                />
                                {errors.phone && <p className="text-[10px] font-bold text-red-500 uppercase mt-1 ml-1 tracking-wider">{errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2 pt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-[#3c72d1] hover:bg-[#3462b5] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </CRMLayout>
    );
};

export default Profile;
