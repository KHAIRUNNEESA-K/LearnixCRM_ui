import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7020/api';
const USE_MOCK_API = false; // Disabled mock API to show real data from backend

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
    (response) => {
        // Handle specific backend response structure
        const data = response.data;
        if (data && data.hasOwnProperty('isSuccess') && !data.isSuccess) {
            return Promise.reject(new Error(data.message || 'Action failed'));
        }
        return data;
    },
    (error) => {
        const message = error.response?.data?.message || error.response?.statusText || error.message;
        return Promise.reject(new Error(message));
    }
);

const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    auth: {
        login: async (credentials) => {
            const response = await apiClient.post('/auth/login', credentials);
            const { data } = response;

            // Map numeric roles: 1 -> Admin, 2 -> Manager, 3 -> Sales
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };

            return {
                token: data.accessToken,
                user: {
                    id: data.userId,
                    name: data.fullName,
                    email: data.email,
                    role: roleMap[data.role] || 'Sales'
                }
            };
        },
        register: async (userData) => {
            // Real backend connection for registration
            const payload = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                contactNumber: userData.contactNumber,
                role: userData.role === 'Manager' ? 2 : 3 // Map roles: Manager -> 2, Sales -> 3
            };
            return apiClient.post('/auth/register', payload);
        },
        setPassword: async (data) => {
            // Always use real backend for setPassword as per user request
            return apiClient.post('/auth/set-password', data);
        }
    },
    users: {
        getAll: async () => {
            // Mapping for roles and statuses from numeric codes to labels
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };
            const statusMap = {
                1: 'Pending',
                2: 'Approve',
                3: 'Active',
                4: 'Rejected',
                5: 'Block',
                6: 'Inactive'
            };

            const response = await apiClient.get('/admin/users');

            // Transform backend data to frontend format
            // response.data holds the user array as per your screenshot
            return response.data.map(u => ({
                id: u.userId,
                name: u.fullName,
                email: u.email,
                role: roleMap[u.role] || 'Sales',
                status: statusMap[u.status] || 'Pending',
                phonenumber: u.contactNumber || 'N/A',
                employeeCode: u.employeeCode,
                joiningDate: u.dateOfJoining,
                profileImage: u.profileImageUrl,
                rejectionReason: u.rejectReason
            }));
        },
        getActive: async () => {
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };
            const statusMap = { 1: 'Pending', 2: 'Approve', 3: 'Active', 4: 'Rejected', 5: 'Block', 6: 'Inactive' };

            const response = await apiClient.get('/admin/users/active');
            return response.data.map(u => ({
                id: u.userId,
                name: u.fullName,
                email: u.email,
                role: roleMap[u.role] || 'Sales',
                status: statusMap[u.status] || 'Active',
                phonenumber: u.contactNumber || 'N/A',
                employeeCode: u.employeeCode,
                joiningDate: u.dateOfJoining,
                profileImage: u.profileImageUrl,
                rejectionReason: u.rejectReason
            }));
        },
        getPending: async () => {
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };
            const statusMap = { 1: 'Pending', 2: 'Approve', 3: 'Active', 4: 'Rejected', 5: 'Block', 6: 'Inactive' };

            const response = await apiClient.get('/admin/users/pending');
            return response.data.map(u => ({
                id: u.userId,
                name: u.fullName,
                email: u.email,
                role: roleMap[u.role] || 'Sales',
                status: statusMap[u.status] || 'Pending',
                phonenumber: u.contactNumber || 'N/A',
                employeeCode: u.employeeCode,
                joiningDate: u.dateOfJoining,
                profileImage: u.profileImageUrl,
                rejectionReason: u.rejectReason
            }));
        },
        getApproved: async () => {
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };
            const statusMap = { 1: 'Pending', 2: 'Approve', 3: 'Active', 4: 'Rejected', 5: 'Block', 6: 'Inactive' };

            const response = await apiClient.get('/admin/users/Approve');
            return response.data.map(u => ({
                id: u.userId,
                name: u.fullName,
                email: u.email,
                role: roleMap[u.role] || 'Sales',
                status: statusMap[u.status] || 'Approve',
                phonenumber: u.contactNumber || 'N/A',
                employeeCode: u.employeeCode,
                joiningDate: u.dateOfJoining,
                profileImage: u.profileImageUrl,
                rejectionReason: u.rejectReason
            }));
        },
        getBlocked: async () => {
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };
            const statusMap = { 1: 'Pending', 2: 'Approve', 3: 'Active', 4: 'Rejected', 5: 'Block', 6: 'Inactive' };

            const response = await apiClient.get('/admin/users/blocked');
            return response.data.map(u => ({
                id: u.userId,
                name: u.fullName,
                email: u.email,
                role: roleMap[u.role] || 'Sales',
                status: statusMap[u.status] || 'Block',
                phonenumber: u.contactNumber || 'N/A',
                employeeCode: u.employeeCode,
                joiningDate: u.dateOfJoining,
                profileImage: u.profileImageUrl,
                rejectionReason: u.rejectReason
            }));
        },
        getRejected: async () => {
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };
            const statusMap = { 1: 'Pending', 2: 'Approve', 3: 'Active', 4: 'Rejected', 5: 'Block', 6: 'Inactive' };

            const response = await apiClient.get('/admin/users/rejected');
            return response.data.map(u => ({
                id: u.userId,
                name: u.fullName,
                email: u.email,
                role: roleMap[u.role] || 'Sales',
                status: statusMap[u.status] || 'Rejected',
                phonenumber: u.contactNumber || 'N/A',
                employeeCode: u.employeeCode,
                joiningDate: u.dateOfJoining,
                profileImage: u.profileImageUrl,
                rejectionReason: u.rejectReason
            }));
        },
        getInactive: async () => {
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };
            const statusMap = { 1: 'Pending', 2: 'Approve', 3: 'Active', 4: 'Rejected', 5: 'Block', 6: 'Inactive' };

            const response = await apiClient.get('/admin/users/inactive');
            return response.data.map(u => ({
                id: u.userId,
                name: u.fullName,
                email: u.email,
                role: roleMap[u.role] || 'Sales',
                status: statusMap[u.status] || 'Inactive',
                phonenumber: u.contactNumber || 'N/A',
                employeeCode: u.employeeCode,
                joiningDate: u.dateOfJoining,
                profileImage: u.profileImageUrl,
                rejectionReason: u.rejectReason
            }));
        },
        getManagers: async () => {
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };
            const statusMap = { 1: 'Pending', 2: 'Approve', 3: 'Active', 4: 'Rejected', 5: 'Block', 6: 'Inactive' };

            const response = await apiClient.get('/admin/users/managers');
            return response.data.map(u => ({
                id: u.userId,
                name: u.fullName,
                email: u.email,
                role: roleMap[u.role] || 'Manager',
                status: statusMap[u.status] || 'Active',
                phonenumber: u.contactNumber || 'N/A',
                employeeCode: u.employeeCode,
                joiningDate: u.dateOfJoining,
                profileImage: u.profileImageUrl,
                rejectionReason: u.rejectReason
            }));
        },
        getSales: async () => {
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };
            const statusMap = { 1: 'Pending', 2: 'Approve', 3: 'Active', 4: 'Rejected', 5: 'Block', 6: 'Inactive' };

            const response = await apiClient.get('/admin/users/sales-executives');
            return response.data.map(u => ({
                id: u.userId,
                name: u.fullName,
                email: u.email,
                role: roleMap[u.role] || 'Sales',
                status: statusMap[u.status] || 'Active',
                phonenumber: u.contactNumber || 'N/A',
                employeeCode: u.employeeCode,
                joiningDate: u.dateOfJoining,
                profileImage: u.profileImageUrl,
                rejectionReason: u.rejectReason
            }));
        },
        getById: async (id) => {
            const roleMap = { 1: 'Admin', 2: 'Manager', 3: 'Sales' };
            const statusMap = { 1: 'Pending', 2: 'Approve', 3: 'Active', 4: 'Rejected', 5: 'Block', 6: 'Inactive' };

            const response = await apiClient.get(`/admin/users/${id}`);
            const u = response.data;
            return {
                id: u.userId,
                name: u.fullName,
                email: u.email,
                role: roleMap[u.role] || 'Sales',
                status: statusMap[u.status] || 'Active',
                phonenumber: u.contactNumber || 'N/A',
                employeeCode: u.employeeCode,
                joiningDate: u.dateOfJoining,
                profileImage: u.profileImageUrl,
                rejectionReason: u.rejectReason
            };
        },
        update: async (id, data) => {
            // Map labels back to numeric codes if necessary for the backend
            const statusReverseMap = { 'Pending': 1, 'Approve': 2, 'Active': 3, 'Rejected': 4, 'Block': 5, 'Inactive': 6 };
            const roleReverseMap = { 'Admin': 1, 'Manager': 2, 'Sales': 3 };

            const payload = { ...data };
            if (data.status) payload.status = statusReverseMap[data.status] || data.status;
            if (data.role) payload.role = roleReverseMap[data.role] || data.role;

            return apiClient.put(`/users/${id}`, payload);
        },
        approve: async (id) => {
            return apiClient.patch(`/admin/users/${id}/approve`);
        },
        reject: async (id, reason) => {
            return apiClient.patch('/admin/users/reject', {
                userId: id,
                rejectReason: reason
            });
        },
        block: async (id) => {
            return apiClient.patch(`/admin/users/${id}/block`);
        },
        unblock: async (id) => {
            return apiClient.patch(`/admin/users/${id}/unblock`);
        },
        delete: async (id) => {
            if (USE_MOCK_API) return mockDelay().then(() => ({ success: true, message: 'User deleted' }));
            return apiClient.delete(`/admin/users/${id}`);
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
                return { targeted: '₹3,000', capacity: '12/15', pendingLeads: 42 };
            }
            return apiClient.get('/dashboard/manager');
        },
        getSalesStats: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return { personalSales: '₹124,500', leadRating: '4.8/5.0', avgCloseTime: '14 Days', closedWon: 24 };
            }
            return apiClient.get('/dashboard/sales');
        }
    },
    leads: {
        getAll: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return [
                    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '9876543210', course: 'Full Stack Development', source: 'Google Ads', status: 'Negotiation', value: '₹45,000', lastContacted: '2 hours ago', managerEmail: 'manager@learnix.com', salesEmail: 'sales@learnix.com' },
                    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '9123456780', course: 'Data Science', source: 'LinkedIn', status: 'Discovery', value: '₹12,500', lastContacted: 'Yesterday', managerEmail: 'manager@learnix.com', salesEmail: null },
                    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', phone: '9988776655', course: 'UI/UX Design', source: 'Referral', status: 'New', value: '₹8,000', lastContacted: '3 hours ago', managerEmail: 'manager@learnix.com', salesEmail: null },
                    { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '9000011111', course: 'Digital Marketing', source: 'Facebook', status: 'Qualified', value: '₹22,000', lastContacted: '5 hours ago', managerEmail: 'manager@learnix.com', salesEmail: 'johndoe@learnix.com' },
                    { id: 5, name: 'Evan Wright', email: 'evan@example.com', phone: '9122334455', course: 'Cloud Computing', source: 'Google Search', status: 'Contacted', value: '₹15,500', lastContacted: '1 day ago', managerEmail: 'manager@learnix.com', salesEmail: null }
                ];
            }
            return apiClient.get('/leads');
        },
        assign: async (leadId, salesEmail) => {
            if (USE_MOCK_API) return mockDelay().then(() => ({ success: true, message: 'Lead assigned successfully' }));
            return apiClient.post(`/leads/${leadId}/assign`, { salesEmail });
        },
        removeAssignment: async (leadId) => {
            if (USE_MOCK_API) return mockDelay().then(() => ({ success: true, message: 'Assignment removed' }));
            return apiClient.delete(`/leads/${leadId}/assign`);
        },
        getById: async (id) => {
            if (USE_MOCK_API) {
                await mockDelay();
                return { id, client: 'Mock Client ' + id, status: 'Qualified', value: '₹25,000', lastContacted: '2 days ago', managerEmail: 'manager@learnix.com', salesEmail: 'sales@learnix.com', description: 'This is a detailed description of the lead for mock purposes.' };
            }
            return apiClient.get(`/leads/${id}`);
        },
        create: async (leadData) => {
            if (USE_MOCK_API) return mockDelay().then(() => ({ success: true, lead: { id: Math.floor(Math.random() * 10000), ...leadData, status: 'New', lastContacted: 'Just now' } }));
            return apiClient.post('/leads', leadData);
        },
        update: async (id, data) => {
            if (USE_MOCK_API) return mockDelay().then(() => ({ success: true, message: 'Lead updated' }));
            return apiClient.put(`/leads/${id}`, data);
        },
        delete: async (id) => {
            if (USE_MOCK_API) return mockDelay().then(() => ({ success: true }));
            return apiClient.delete(`/leads/${id}`);
        }
    },
    admissions: {
        getAll: async () => {
            if (USE_MOCK_API) {
                await mockDelay();
                return [
                    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '9876543210', course: 'Full Stack Development', totalFee: '₹3,500', feePaid: '₹2,500', joiningDate: '2024-01-15', managerEmail: 'manager@learnix.com' },
                    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '9123456780', course: 'Data Science', totalFee: '₹4,000', feePaid: '₹3,000', joiningDate: '2024-02-01', managerEmail: 'manager@learnix.com' },
                    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '9988776655', course: 'UI/UX Design', totalFee: '₹2,500', feePaid: '₹1,800', joiningDate: '2024-02-10', managerEmail: 'alice.m@learnix.com' },
                    { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '9871234560', course: 'Cybersecurity', totalFee: '₹3,800', feePaid: '₹2,800', joiningDate: '2024-03-05', managerEmail: 'dan.o@learnix.com' },
                    { id: 5, name: 'Evan Wright', email: 'evan@example.com', phone: '9122334455', course: 'Cloud Computing', totalFee: '₹3,000', feePaid: '₹2,200', joiningDate: '2024-03-20', managerEmail: 'manager@learnix.com' },
                    { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', phone: '9223344556', course: 'Digital Marketing', totalFee: '₹2,200', feePaid: '₹1,500', joiningDate: '2024-04-01', managerEmail: 'alice.m@learnix.com' },
                    { id: 7, name: 'George Miller', email: 'george@example.com', phone: '9334455667', course: 'AI & ML', totalFee: '₹5,000', feePaid: '₹4,000', joiningDate: '2024-04-10', managerEmail: 'dan.o@learnix.com' },
                    { id: 8, name: 'Hannah Abbott', email: 'hannah@example.com', phone: '9445566778', course: 'Business Analytics', totalFee: '₹3,200', feePaid: '₹2,500', joiningDate: '2024-04-20', managerEmail: 'grace.h@learnix.com' },
                    { id: 9, student_id: 'AD-009', name: 'Ian Wright', email: 'ian@example.com', phone: '9556677889', course: 'Cloud Computing', totalFee: '₹3,000', feePaid: '₹3,000', joiningDate: '2024-05-01', managerEmail: 'manager@learnix.com' },
                    { id: 10, student_id: 'AD-010', name: 'Julia Roberts', email: 'julia@example.com', phone: '9667788990', course: 'Full Stack Development', totalFee: '₹3,500', feePaid: '₹1,000', joiningDate: '2024-05-15', managerEmail: 'manager@learnix.com' },
                    { id: 11, student_id: 'AD-011', name: 'Kevin Hart', email: 'kevin@example.com', phone: '9778899001', course: 'Data Science', totalFee: '₹4,000', feePaid: '₹2,000', joiningDate: '2024-06-01', managerEmail: 'alice.m@learnix.com' },
                    { id: 12, student_id: 'AD-012', name: 'Laura Palmer', email: 'laura@example.com', phone: '9889900112', course: 'UI/UX Design', totalFee: '₹2,500', feePaid: '₹2,500', joiningDate: '2024-06-15', managerEmail: 'manager@learnix.com' },
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
                    { category: 'Full Stack Development', count: 85, revenue: '₹297,500', trend: 'up' },
                    { category: 'Data Science', count: 64, revenue: '₹256,000', trend: 'up' },
                    { category: 'UI/UX Design', count: 52, revenue: '₹130,000', trend: 'down' },
                    { category: 'Cybersecurity', count: 38, revenue: '₹144,400', trend: 'up' },
                    { category: 'Cloud Computing', count: 42, revenue: '₹126,000', trend: 'stable' },
                    { category: 'Digital Marketing', count: 75, revenue: '₹150,000', trend: 'up' },
                    { category: 'AI & ML', count: 45, revenue: '₹225,000', trend: 'up' },
                    { category: 'Business Analytics', count: 30, revenue: '₹96,000', trend: 'stable' },
                    { category: 'Mobile App Dev', count: 48, revenue: '₹168,000', trend: 'up' },
                    { category: 'Blockchain', count: 12, revenue: '₹60,000', trend: 'down' }
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
    },
    courses: {
        getAll: async () => {
            const response = await apiClient.get('/admin/courses');
            // Support both direct array and wrapped data structure
            const data = response.data || response;
            return data.map(c => ({
                id: c.courseId,
                name: c.name,
                duration: `${c.courseDuration} Months`,
                price: c.fee.toLocaleString('en-IN'),
                status: c.isActive ? 'Active' : 'Inactive'
            }));
        },
        create: async (courseData) => {
            const payload = {
                name: courseData.name,
                courseDuration: parseInt(courseData.duration),
                fee: parseFloat(courseData.price.replace(/,/g, ''))
            };
            return apiClient.post('/admin/courses', payload);
        },
        update: async (courseId, courseData) => {
            const payload = {
                courseId: courseId,
                name: courseData.name,
                courseDuration: parseInt(courseData.duration) || 0,
                fee: parseFloat(courseData.price.toString().replace(/,/g, '')) || 0
            };
            return apiClient.put('/admin/courses', payload);
        },
        delete: async (courseId) => {
            return apiClient.delete(`/admin/courses/${courseId}`);
        }
    }
};
