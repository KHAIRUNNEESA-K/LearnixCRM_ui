import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { api } from '../../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.auth.login({ email, password });
            login(response.user, response.token);

            if (response.user.role === 'Admin') navigate('/admin');
            else if (response.user.role === 'Manager') navigate('/manager');
            else navigate('/sales');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="card glass w-[400px] border-none bg-white/5">
                <h2 className="text-white mb-2 text-[28px] font-bold">Welcome Back</h2>
                <p className="text-gray-400 mb-8">Login to your LearnixCRM account</p>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="text-gray-300">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            required
                            className="bg-black/20 border-gray-700 text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label className="text-gray-300">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            className="bg-black/20 border-gray-700 text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary w-full p-3.5 mt-3 justify-center disabled:opacity-50">
                        <LogIn size={20} /> {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    {error && <p className="text-danger mt-3 text-center text-sm">{error}</p>}
                </form>

                <div className="mt-6 text-center text-gray-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-primary font-semibold">Register here</Link>
                </div>

                <div className="mt-5 p-3 bg-primary/10 rounded-lg text-xs text-indigo-300">
                    Try using <b>admin@learnix.com</b>, <b>manager@learnix.com</b>, or <b>sales@learnix.com</b>
                </div>
            </div>
        </div>
    );
};

export default Login;
