import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK_API = true;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('learnix_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.response?.statusText || error.message;
        return Promise.reject(new Error(message));
    }
);

const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    auth: {
        login: async (credentials) => {
            if (USE_MOCK_API) {
                await mockDelay();
                let role = 'Sales';
                if (credentials.email.includes('admin')) role = 'Admin';
                else if (credentials.email.includes('manager')) role = 'Manager';
                return { token: 'mock-jwt-token-123', user: { email: credentials.email, name: credentials.email.split('@')[0], role } };
            }
            return apiClient.post('/auth/login', credentials);
        },
        register: async (userData) => {
            if (USE_MOCK_API) {
                await mockDelay();
                return { success: true, message: 'User registered successfully.' };
            }
            return apiClient.post('/auth/register', userData);
        }
    },
    users: {
        getAll: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return [
                    { id: 1, email: 'manager@learnix.com', name: 'Nisa', phonenumber: '9207769041', role: 'Manager', status: 'Approve', managerEmail: 'admin@learnix.com', salesEmail: 'sales@learnix.com' },
                    { id: 2, email: 'sales@learnix.com', name: 'Sidharth', phonenumber: '9876543210', role: 'Sales', status: 'Pending', managerEmail: 'manager@learnix.com', salesEmail: 'sales@learnix.com' },
                    { id: 3, email: 'johndoe@learnix.com', name: 'John Doe', phonenumber: '8909976789', role: 'Sales', status: 'Inactive', managerEmail: 'manager@learnix.com', salesEmail: 'johndoe@learnix.com' },
                    { id: 4, email: 'mark@learnix.com', name: 'Mark Smith', phonenumber: '8877990066', role: 'Sales', status: 'Block', managerEmail: 'manager@learnix.com', salesEmail: 'mark@learnix.com' },
                    { id: 5, email: 'alice.m@learnix.com', name: 'Alice Munroe', phonenumber: '9988776655', role: 'Manager', status: 'Active', managerEmail: 'admin@learnix.com', salesEmail: 'sales.exec@learnix.com' },
                    { id: 6, email: 'bob.c@learnix.com', name: 'Bob Carter', phonenumber: '8899776655', role: 'Sales', status: 'Pending', managerEmail: 'alice.m@learnix.com', salesEmail: 'bob.c@learnix.com' },
                    { id: 7, email: 'cynthia.l@learnix.com', name: 'Cynthia Liu', phonenumber: '7788990011', role: 'Sales', status: 'Approve', managerEmail: 'alice.m@learnix.com', salesEmail: 'cynthia.l@learnix.com' },
                    { id: 8, email: 'dan.o@learnix.com', name: 'Daniel Orta', phonenumber: '6677889900', role: 'Manager', status: 'Active', managerEmail: 'admin@learnix.com', salesEmail: 'sales.exec2@learnix.com' },
                    { id: 9, email: 'elena.g@learnix.com', name: 'Elena Gilbert', phonenumber: '5566778899', role: 'Sales', status: 'Rejected', managerEmail: 'dan.o@learnix.com', salesEmail: 'elena.g@learnix.com' },
                    { id: 10, email: 'frank.w@learnix.com', name: 'Frank Wright', phonenumber: '4455667788', role: 'Sales', status: 'Pending', managerEmail: 'dan.o@learnix.com', salesEmail: 'frank.w@learnix.com' },
                    { id: 11, email: 'grace.h@learnix.com', name: 'Grace Hopper', phonenumber: '3344556677', role: 'Manager', status: 'Active', managerEmail: 'admin@learnix.com', salesEmail: 'sales.exec3@learnix.com' },
                    { id: 12, email: 'harry.p@learnix.com', name: 'Harry Potter', phonenumber: '2233445566', role: 'Sales', status: 'Block', managerEmail: 'grace.h@learnix.com', salesEmail: 'harry.p@learnix.com' },
                    { id: 13, email: 'isabella.s@learnix.com', name: 'Isabella Swan', phonenumber: '1122334455', role: 'Sales', status: 'Inactive', managerEmail: 'grace.h@learnix.com', salesEmail: 'isabella.s@learnix.com' },
                    { id: 14, email: 'jack.s@learnix.com', name: 'Jack Sparrow', phonenumber: '9988112233', role: 'Manager', status: 'Pending', managerEmail: 'admin@learnix.com', salesEmail: 'sales.exec4@learnix.com' },
                    { id: 15, email: 'kate.b@learnix.com', name: 'Kate Bishop', phonenumber: '8877223344', role: 'Sales', status: 'Active', managerEmail: 'jack.s@learnix.com', salesEmail: 'kate.b@learnix.com' },
                    { id: 16, email: 'liam.n@learnix.com', name: 'Liam Neeson', phonenumber: '7766334455', role: 'Sales', status: 'Approve', managerEmail: 'jack.s@learnix.com', salesEmail: 'liam.n@learnix.com' },
                ];
            }
            return apiClient.get('/users');
        },
        update: async (id, data) => {
            if (USE_MOCK_API) return mockDelay().then(() => ({ success: true, message: 'User updated' }));
            return apiClient.put(`/users/${id}`, data);
        },
        delete: async (id) => {
            if (USE_MOCK_API) return mockDelay().then(() => ({ success: true, message: 'User deleted' }));
            return apiClient.delete(`/users/${id}`);
        }
    },
    dashboard: {
        getAdminStats: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return {
                    stats: [
                        { title: 'Total Users', value: '150', change: '+12%' },
                        { title: 'System Uptime', value: '99.9%', change: 'Stable' },
                        { title: 'Database Size', value: '4.2 GB', change: '+200MB' },
                        { title: 'Active Alerts', value: '3', change: 'Critical' }
                    ]
                };
            }
            return apiClient.get('/dashboard/admin');
        },
        getManagerStats: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return { targeted: '$1.2M', capacity: '12/15', pendingLeads: 42 };
            }
            return apiClient.get('/dashboard/manager');
        },
        getSalesStats: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return { personalSales: '$124,500', leadRating: '4.8/5.0', avgCloseTime: '14 Days', closedWon: 24 };
            }
            return apiClient.get('/dashboard/sales');
        }
    },
    leads: {
        getAll: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return [
                    { id: 1, client: 'Acme Dynamics', status: 'Negotiation', value: '$45,000', lastContacted: '2 hours ago' },
                    { id: 2, client: 'Global Tech Inc.', status: 'Discovery', value: '$12,500', lastContacted: 'Yesterday' }
                ];
            }
            return apiClient.get('/leads');
        }
    },
    admissions: {
        getAll: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return [
                    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '9876543210', course: 'Full Stack Development', totalFee: '$3,500', feePaid: '$2,500', joiningDate: '2024-01-15' },
                    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '9123456780', course: 'Data Science', totalFee: '$4,000', feePaid: '$3,000', joiningDate: '2024-02-01' },
                    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '9988776655', course: 'UI/UX Design', totalFee: '$2,500', feePaid: '$1,800', joiningDate: '2024-02-10' },
                    { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '9871234560', course: 'Cybersecurity', totalFee: '$3,800', feePaid: '$2,800', joiningDate: '2024-03-05' },
                    { id: 5, name: 'Evan Wright', email: 'evan@example.com', phone: '9122334455', course: 'Cloud Computing', totalFee: '$3,000', feePaid: '$2,200', joiningDate: '2024-03-20' },
                    { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', phone: '9223344556', course: 'Digital Marketing', totalFee: '$2,200', feePaid: '$1,500', joiningDate: '2024-04-01' },
                    { id: 7, name: 'George Miller', email: 'george@example.com', phone: '9334455667', course: 'AI & ML', totalFee: '$5,000', feePaid: '$4,000', joiningDate: '2024-04-10' },
                    { id: 8, name: 'Hannah Abbott', email: 'hannah@example.com', phone: '9445566778', course: 'Business Analytics', totalFee: '$3,200', feePaid: '$2,500', joiningDate: '2024-04-20' },
                    { id: 9, student_id: 'AD-009', name: 'Ian Wright', email: 'ian@example.com', phone: '9556677889', course: 'Cloud Computing', totalFee: '$3,000', feePaid: '$3,000', joiningDate: '2024-05-01' },
                    { id: 10, student_id: 'AD-010', name: 'Julia Roberts', email: 'julia@example.com', phone: '9667788990', course: 'Full Stack Development', totalFee: '$3,500', feePaid: '$1,000', joiningDate: '2024-05-15' },
                    { id: 11, student_id: 'AD-011', name: 'Kevin Hart', email: 'kevin@example.com', phone: '9778899001', course: 'Data Science', totalFee: '$4,000', feePaid: '$2,000', joiningDate: '2024-06-01' },
                    { id: 12, student_id: 'AD-012', name: 'Laura Palmer', email: 'laura@example.com', phone: '9889900112', course: 'UI/UX Design', totalFee: '$2,500', feePaid: '$2,500', joiningDate: '2024-06-15' },
                ];
            }
            return apiClient.get('/admissions');
        }
    },
    reports: {
        getLeadsReport: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return [
                    { month: 'Jan', totalLeads: 120, convertedLeads: 45, pendingLeads: 75, revenue: 150000 },
                    { month: 'Feb', totalLeads: 150, convertedLeads: 60, pendingLeads: 90, revenue: 210000 },
                    { month: 'Mar', totalLeads: 140, convertedLeads: 55, pendingLeads: 85, revenue: 190000 },
                    { month: 'Apr', totalLeads: 180, convertedLeads: 80, pendingLeads: 100, revenue: 280000 },
                    { month: 'May', totalLeads: 210, convertedLeads: 95, pendingLeads: 115, revenue: 350000 },
                    { month: 'Jun', totalLeads: 250, convertedLeads: 110, pendingLeads: 140, revenue: 420000 },
                    { month: 'Jul', totalLeads: 230, convertedLeads: 100, pendingLeads: 130, revenue: 380000 },
                    { month: 'Aug', totalLeads: 270, convertedLeads: 120, pendingLeads: 150, revenue: 460000 },
                    { month: 'Sep', totalLeads: 310, convertedLeads: 140, pendingLeads: 170, revenue: 520000 },
                    { month: 'Oct', totalLeads: 290, convertedLeads: 130, pendingLeads: 160, revenue: 490000 },
                    { month: 'Nov', totalLeads: 330, convertedLeads: 155, pendingLeads: 175, revenue: 580000 },
                    { month: 'Dec', totalLeads: 350, convertedLeads: 170, pendingLeads: 180, revenue: 620000 }
                ];
            }
            return apiClient.get('/admin/reports/leads');
        },
        getAdmissionsReport: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return [
                    { category: 'Full Stack Development', count: 85, revenue: '$297,500', trend: 'up' },
                    { category: 'Data Science', count: 64, revenue: '$256,000', trend: 'up' },
                    { category: 'UI/UX Design', count: 52, revenue: '$130,000', trend: 'down' },
                    { category: 'Cybersecurity', count: 38, revenue: '$144,400', trend: 'up' },
                    { category: 'Cloud Computing', count: 42, revenue: '$126,000', trend: 'stable' },
                    { category: 'Digital Marketing', count: 75, revenue: '$150,000', trend: 'up' },
                    { category: 'AI & ML', count: 45, revenue: '$225,000', trend: 'up' },
                    { category: 'Business Analytics', count: 30, revenue: '$96,000', trend: 'stable' },
                    { category: 'Mobile App Dev', count: 48, revenue: '$168,000', trend: 'up' },
                    { category: 'Blockchain', count: 12, revenue: '$60,000', trend: 'down' }
                ];
            }
            return apiClient.get('/admin/reports/admissions');
        },
        getPerformanceReport: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return [
                    { name: 'Nisa', role: 'Manager', teamSales: 125, conversion: '45%', achievement: '104%', status: 'Excellent' },
                    { name: 'Alice Munroe', role: 'Manager', teamSales: 98, conversion: '38%', achievement: '89%', status: 'Good' },
                    { name: 'Daniel Orta', role: 'Manager', teamSales: 110, conversion: '41%', achievement: '95%', status: 'Excellent' },
                    { name: 'Grace Hopper', role: 'Manager', teamSales: 145, conversion: '52%', achievement: '112%', status: 'Outstanding' },
                    { name: 'Sidharth', role: 'Sales', personalSales: 42, conversion: '32%', achievement: '110%', status: 'Excellent' },
                    { name: 'Bob Carter', role: 'Sales', personalSales: 38, conversion: '28%', achievement: '95%', status: 'Good' },
                    { name: 'Cynthia Liu', role: 'Sales', personalSales: 55, conversion: '48%', achievement: '120%', status: 'Outstanding' },
                    { name: 'Elena Gilbert', role: 'Sales', personalSales: 29, conversion: '22%', achievement: '82%', status: 'Average' },
                    { name: 'Frank Wright', role: 'Sales', personalSales: 35, conversion: '30%', achievement: '90%', status: 'Good' },
                    { name: 'Harry Potter', role: 'Sales', personalSales: 48, conversion: '40%', achievement: '105%', status: 'Excellent' }
                ];
            }
            return apiClient.get('/admin/reports/performance');
        },
        exportReport: async (type = 'excel') => {
            if (USE_MOCK_API) {
                await mockDelay();
                return { success: true, message: `Report exported successfully as ${type}` };
            }
            return apiClient.get(`/admin/reports/export?type=${type}`);
        }
    },
    profile: {
        update: async (data) => {
            if (USE_MOCK_API) {
                await mockDelay();
                return { success: true, message: 'Profile updated successfully' };
            }
            return apiClient.put('/profile', data);
        }
    }
};
