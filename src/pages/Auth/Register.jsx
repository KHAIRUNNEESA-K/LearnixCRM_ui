import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';
import { api } from '../../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Sales'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.auth.register(formData);
            toast.success(`Registration successful! Redirecting to login...`, { toastId: 'register-success' });
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="card glass w-[450px] border-none bg-white/5">
                <h2 className="text-white mb-2 text-[28px] font-bold">Create Account</h2>
                <p className="text-gray-400 mb-8">Join the LearnixCRM platform</p>

                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label className="text-gray-300">Full Name</label>
                        <input
                            type="text"
                            required
                            className="bg-black/20 border-gray-700 text-white"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="text-gray-300">Email Address</label>
                        <input
                            type="email"
                            required
                            className="bg-black/20 border-gray-700 text-white"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="text-gray-300">Desired Role</label>
                        <select
                            className="bg-black/20 border border-gray-700 text-white w-full p-3 rounded-lg"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="Sales" className="bg-gray-900">Sales Executive</option>
                            <option value="Manager" className="bg-gray-900">Manager</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="text-gray-300">Password</label>
                        <input
                            type="password"
                            required
                            className="bg-black/20 border-gray-700 text-white"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary w-full p-3.5 mt-3 justify-center disabled:opacity-50">
                        <UserPlus size={20} /> {loading ? 'Registering...' : 'Register Account'}
                    </button>
                    {error && <p className="text-danger mt-3 text-center text-sm">{error}</p>}
                </form>

                <div className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account? <Link to="/login" className="text-primary font-semibold">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
