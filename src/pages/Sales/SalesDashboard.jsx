import React from 'react';
import { CRMLayout } from '../../components/CRMLayout';
import { ShoppingBag, Star, Clock, CheckCircle } from 'lucide-react';

const SalesDashboard = () => {
    return (
        <CRMLayout role="Sales" title="My Sales Pipeline">

            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="card">
                    <ShoppingBag className="text-primary mt-1" size={28} />
                    <h3 className="mt-4 text-sm font-semibold text-text-muted">Personal Sales</h3>
                    <h2 className="text-2xl font-bold mt-1">$124,500</h2>
                </div>
                <div className="card">
                    <Star className="text-amber-500 mt-1" size={28} />
                    <h3 className="mt-4 text-sm font-semibold text-text-muted">Lead Rating</h3>
                    <h2 className="text-2xl font-bold mt-1">4.8/5.0</h2>
                </div>
                <div className="card">
                    <Clock className="text-purple-500 mt-1" size={28} />
                    <h3 className="mt-4 text-sm font-semibold text-text-muted">Avg. Close Time</h3>
                    <h2 className="text-2xl font-bold mt-1">14 Days</h2>
                </div>
                <div className="card">
                    <CheckCircle className="text-secondary mt-1" size={28} />
                    <h3 className="mt-4 text-sm font-semibold text-text-muted">Closed/Won</h3>
                    <h2 className="text-2xl font-bold mt-1">24</h2>
                </div>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Active Leads</h3>
                    <button className="btn btn-primary px-4 py-2 text-sm shadow-sm hover:shadow-md">+ New Lead</button>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left border-b border-border text-sm text-text-muted pb-3">
                            <th className="font-semibold py-3">Client Name</th>
                            <th className="font-semibold">Status</th>
                            <th className="font-semibold">Value</th>
                            <th className="font-semibold">Last contacted</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-border hover:bg-black/5 transition-colors">
                            <td className="py-4 font-medium">Acme Dynamics</td>
                            <td><span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-md text-xs font-semibold">Negotiation</span></td>
                            <td className="font-medium">$45,000</td>
                            <td className="text-sm text-text-muted">2 hours ago</td>
                        </tr>
                        <tr className="border-b border-border hover:bg-black/5 transition-colors">
                            <td className="py-4 font-medium">Global Tech Inc.</td>
                            <td><span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">Discovery</span></td>
                            <td className="font-medium">$12,500</td>
                            <td className="text-sm text-text-muted">Yesterday</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CRMLayout>
    );
};

export default SalesDashboard;
