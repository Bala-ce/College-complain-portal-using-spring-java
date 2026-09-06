const BASE_URL = 'http://192.168.29.226:8080/api/complaints';

/**
 * Helper to handle fetch responses
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text().catch(() => 'Unknown error');
    throw new Error(`Error ${response.status}: ${error}`);
  }
  // Check if response has content before parsing JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
};

export const api = {
  // --- Auth Endpoints ---
  login: async (credentials) => {
    const response = await fetch(`http://192.168.29.226:8080/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`http://192.168.29.226:8080/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  changePassword: async (email, newPassword) => {
    const response = await fetch(`http://192.168.29.226:8080/api/auth/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    return handleResponse(response);
  },

  forgotPassword: async (email, newPassword) => {
    const response = await fetch(`http://192.168.29.226:8080/api/auth/forgot-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`http://192.168.29.226:8080/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // 1. POST /api/complaints -> Save a new complaint
  createComplaint: async (complaintData) => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
    });
    return handleResponse(response);
  },

  // 2. GET /api/complaints -> Fetch all complaints
  getAllComplaints: async () => {
    const response = await fetch(BASE_URL);
    return handleResponse(response);
  },

  // 3. GET /api/complaints/student?email={email} -> Fetch complaints by student email
  getComplaintsByStudent: async (studentEmail) => {
    const response = await fetch(`${BASE_URL}/student?email=${encodeURIComponent(studentEmail)}`);
    return handleResponse(response);
  },

  // 4. GET /api/complaints/dept/{department} -> Fetch complaints by department
  getComplaintsByDepartment: async (department) => {
    const response = await fetch(`${BASE_URL}/dept/${department}`);
    return handleResponse(response);
  },

  // 5. GET /api/complaints/track/{code} -> Fetch single complaint by code
  getComplaintByCode: async (code) => {
    const response = await fetch(`${BASE_URL}/track/${code}`);
    return handleResponse(response);
  },

  // 6. PATCH /api/complaints/{id}/status -> Update status & official reply
  updateComplaintStatus: async (id, status, officialReply) => {
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (officialReply !== undefined) updates.officialReply = officialReply;

    const response = await fetch(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  }
};
