import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Users,
    Target,
    GraduationCap,
    BarChart2,
    TrendingUp,
    ClipboardList,
    LayoutDashboard,
    UserCircle,
    LogOut,
    Code2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import TopNavbar from './TopNavbar';
const Sidebar = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = {
        Admin: [
            { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
            { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
            { name: 'Lead Management', path: '/admin/leads', icon: <Target size={20} /> },
            { name: 'Team Management', path: '/admin/team', icon: <Users size={20} /> },
            { name: 'Admissions', path: '/admin/admissions', icon: <GraduationCap size={20} /> },
            { name: 'Reports', path: '/admin/reports', icon: <BarChart2 size={20} /> },
            { name: 'Sales Analytics', path: '/admin/analytics', icon: <TrendingUp size={20} /> },
            { name: 'System Logs', path: '/admin/logs', icon: <ClipboardList size={20} /> }
        ],
        Manager: [
            { name: 'Overview', path: '/manager', icon: <LayoutDashboard size={20} /> },
            { name: 'Team Sales', path: '#', icon: <TrendingUp size={20} /> },
            { name: 'Performance', path: '#', icon: <BarChart2 size={20} /> }
        ],
        Sales: [
            { name: 'Active Leads', path: '/sales', icon: <Users size={20} /> },
            { name: 'My Pipeline', path: '#', icon: <TrendingUp size={20} /> },
            { name: 'Analytics', path: '#', icon: <BarChart2 size={20} /> }
        ]
    };

    return (
        <div className="w-64 bg-[#2f3d5a] text-white flex flex-col transition-all duration-300 shadow-xl z-20">
            <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#1e293b]/50">
                <div className="flex items-center gap-3">
                    <div className="bg-[#3c72d1] p-2 rounded-xl shadow-lg ring-4 ring-[#3c72d1]/10">
                        <GraduationCap size={22} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight text-white leading-none">Learnix<span className="text-[#3c72d1]">CRM</span></span>
                        <span className="text-[9px] uppercase tracking-[0.15em] text-slate-400 font-bold mt-1">Software Institute</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 py-4">
                <ul className="list-none px-4">
                    {menuItems[role]?.map((item) => (
                        <li key={item.name} className="mb-2">
                            <button
                                onClick={() => item.path !== '#' && navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === item.path ? 'text-white bg-[#3c72d1] shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                                {item.icon}
                                <span className="font-medium text-sm">{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

        </div>
    );
};

export const CRMLayout = ({ children, role, title }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
            <Sidebar role={role} />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 pb-12">
                    <TopNavbar title={title} />
                    {children}
                </div>
            </main>
        </div>
    );
};
