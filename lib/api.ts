import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  refresh: (refreshToken: string) =>
    api.post("/auth/refresh", { refreshToken }),
  getProfile: () => api.get("/auth/profile"),
};

// Students
export const studentsApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/students", { params }),
  getById: (id: string) => api.get(`/students/${id}`),
  create: (data: unknown) => api.post("/students", data),
  update: (id: string, data: unknown) => api.patch(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
  getAttendance: (id: string, params?: Record<string, unknown>) =>
    api.get(`/students/${id}/attendance`, { params }),
  getGrades: (id: string, params?: Record<string, unknown>) =>
    api.get(`/students/${id}/grades`, { params }),
  getPayments: (id: string) => api.get(`/students/${id}/payments`),
};

// Teachers
export const teachersApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/teachers", { params }),
  getById: (id: string) => api.get(`/teachers/${id}`),
  create: (data: unknown) => api.post("/teachers", data),
  update: (id: string, data: unknown) => api.patch(`/teachers/${id}`, data),
  delete: (id: string) => api.delete(`/teachers/${id}`),
  getGroups: (id: string) => api.get(`/teachers/${id}/groups`),
};

// Groups
export const groupsApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/groups", { params }),
  getById: (id: string) => api.get(`/groups/${id}`),
  create: (data: unknown) => api.post("/groups", data),
  update: (id: string, data: unknown) => api.patch(`/groups/${id}`, data),
  delete: (id: string) => api.delete(`/groups/${id}`),
  addStudent: (groupId: string, studentId: string) =>
    api.post(`/groups/${groupId}/students`, { studentId }),
  removeStudent: (groupId: string, studentId: string) =>
    api.delete(`/groups/${groupId}/students/${studentId}`),
};

// Subjects
export const subjectsApi = {
  getAll: () => api.get("/subjects"),
  create: (data: unknown) => api.post("/subjects", data),
  update: (id: string, data: unknown) => api.patch(`/subjects/${id}`, data),
  delete: (id: string) => api.delete(`/subjects/${id}`),
};

// Schedules
export const schedulesApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/schedules", { params }),
  getById: (id: string) => api.get(`/schedules/${id}`),
  create: (data: unknown) => api.post("/schedules", data),
  update: (id: string, data: unknown) => api.patch(`/schedules/${id}`, data),
  delete: (id: string) => api.delete(`/schedules/${id}`),
  getWeekly: (params?: Record<string, unknown>) => api.get("/schedules/weekly", { params }),
};

// Attendance
export const attendanceApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/attendance", { params }),
  mark: (data: unknown) => api.post("/attendance", data),
  markBulk: (data: unknown) => api.post("/attendance/bulk", data),
  update: (id: string, data: unknown) => api.patch(`/attendance/${id}`, data),
  getReport: (params?: Record<string, unknown>) => api.get("/attendance/report", { params }),
  getMonthly: (params?: Record<string, unknown>) => api.get("/attendance/monthly", { params }),
};

// Payments
export const paymentsApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/payments", { params }),
  getById: (id: string) => api.get(`/payments/${id}`),
  create: (data: unknown) => api.post("/payments", data),
  update: (id: string, data: unknown) => api.patch(`/payments/${id}`, data),
  delete: (id: string) => api.delete(`/payments/${id}`),
  getDashboard: () => api.get("/payments/dashboard"),
  getReport: (params?: Record<string, unknown>) => api.get("/payments/report", { params }),
};

// Grades
export const gradesApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/grades", { params }),
  create: (data: unknown) => api.post("/grades", data),
  update: (id: string, data: unknown) => api.patch(`/grades/${id}`, data),
  delete: (id: string) => api.delete(`/grades/${id}`),
  getByGroup: (groupId: string, params?: Record<string, unknown>) =>
    api.get(`/grades/group/${groupId}`, { params }),
};

// Notifications
export const notificationsApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/notifications", { params }),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
  send: (data: unknown) => api.post("/notifications/send", data),
  sendBulk: (data: unknown) => api.post("/notifications/send-bulk", data),
};

// Homework
export const homeworkApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/homework", { params }),
  getById: (id: string) => api.get(`/homework/${id}`),
  create: (data: unknown) => api.post("/homework", data),
  update: (id: string, data: unknown) => api.patch(`/homework/${id}`, data),
  delete: (id: string) => api.delete(`/homework/${id}`),
  submit: (id: string, data: unknown) => api.post(`/homework/${id}/submit`, data),
  grade: (id: string, submissionId: string, data: unknown) =>
    api.patch(`/homework/${id}/submissions/${submissionId}`, data),
};

// Materials
export const materialsApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/materials", { params }),
  create: (data: unknown) => api.post("/materials", data),
  delete: (id: string) => api.delete(`/materials/${id}`),
};

// Reports / Analytics
export const reportsApi = {
  getDashboardStats: () => api.get("/reports/dashboard"),
  getRevenue: (params?: Record<string, unknown>) => api.get("/reports/revenue", { params }),
  getAttendanceReport: (params?: Record<string, unknown>) =>
    api.get("/reports/attendance", { params }),
  getStudentReport: (params?: Record<string, unknown>) =>
    api.get("/reports/students", { params }),
  getTeacherReport: (params?: Record<string, unknown>) =>
    api.get("/reports/teachers", { params }),
};

// Expenses
export const expensesApi = {
  getAll: (params?: Record<string, unknown>) => api.get("/expenses", { params }),
  create: (data: unknown) => api.post("/expenses", data),
  update: (id: string, data: unknown) => api.patch(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};
