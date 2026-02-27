import React from 'react';
import { LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TopNavbar = ({ title }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="sticky top-0 z-30 flex justify-between items-center mb-8 bg-white px-8 py-4 border-b border-gray-200 -mx-8 -mt-8 shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>

            <div className="flex items-center gap-4">
                {/* Profile Icon/Image */}
                <button
                    onClick={() => navigate('/admin/profile')}
                    className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border border-gray-200 hover:border-[#3c72d1] transition-all"
                >
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle size={24} className="text-gray-400 hover:text-[#3c72d1]" />
                    )}
                </button>

                {/* Quick Logout Icon */}
                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export default TopNavbar;
