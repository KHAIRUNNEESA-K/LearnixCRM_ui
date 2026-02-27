import React, { useEffect, useState } from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import { BarChart, Users, TrendingUp, Target } from 'lucide-react';
import { api } from '../../services/api';

const ManagerDashboard = () => {
    const [stats, setStats] = useState({ targeted: '$0', capacity: '0/0', pendingLeads: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await api.dashboard.getManagerStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load manager dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    return (
        <CRMLayout role="Manager" title="Manager Overview">

            {loading ? (
                <div className="text-text-muted">Loading dashboard data...</div>
            ) : (
                <>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="card bg-gradient-to-br from-primary to-indigo-800 text-white">
                            <TrendingUp size={32} className="mb-3" />
                            <h3 className="font-semibold text-white/90">Quarterly Targeted</h3>
                            <h2 className="text-3xl font-bold mt-1">{stats.targeted}</h2>
                            <p className="opacity-80 text-sm mt-1">85% achieved</p>
                        </div>
                        <div className="card">
                            <Users size={32} className="text-primary mb-3" />
                            <h3 className="font-semibold text-text-muted">Team Capacity</h3>
                            <h2 className="text-3xl font-bold mt-1">{stats.capacity}</h2>
                            <p className="text-text-muted text-sm mt-1">Sales reps online</p>
                        </div>
                        <div className="card">
                            <Target size={32} className="text-secondary mb-3" />
                            <h3 className="font-semibold text-text-muted">Pending Leads</h3>
                            <h2 className="text-3xl font-bold mt-1">{stats.pendingLeads}</h2>
                            <p className="text-text-muted text-sm mt-1">Requires assignment</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
                        <div className="card">
                            <h3 className="font-bold text-lg">Lead Allocation</h3>
                            <div className="h-[200px] flex items-end gap-3 mt-5">
                                <div className="h-[80%] w-full bg-primary rounded"></div>
                                <div className="h-[60%] w-full bg-primary rounded"></div>
                                <div className="h-[90%] w-full bg-primary rounded"></div>
                                <div className="h-[40%] w-full bg-primary rounded"></div>
                                <div className="h-[75%] w-full bg-primary rounded"></div>
                            </div>
                            <div className="flex justify-between text-xs mt-2 text-text-muted font-medium">
                                <span>Rep A</span><span>Rep B</span><span>Rep C</span><span>Rep D</span><span>Rep E</span>
                            </div>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-lg">Top Performers</h3>
                            <ul className="mt-5 flex flex-col gap-4">
                                <li className="flex justify-between items-center bg-bg-main p-3 rounded-xl border border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex-shrink-0 bg-white shadow-sm border border-border rounded-full"></div>
                                        <span className="font-semibold">Sarah Connor</span>
                                    </div>
                                    <span className="font-bold text-primary">$450k</span>
                                </li>
                                <li className="flex justify-between items-center bg-bg-main p-3 rounded-xl border border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex-shrink-0 bg-white shadow-sm border border-border rounded-full"></div>
                                        <span className="font-semibold">John Miller</span>
                                    </div>
                                    <span className="font-bold text-primary">$320k</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </CRMLayout>
    );
};

export default ManagerDashboard;
