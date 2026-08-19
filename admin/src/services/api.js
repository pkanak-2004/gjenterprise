const API_BASE = '/api';

export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.token) {
    throw new Error(data.message || 'Invalid email or password');
  }

  return data;
};

export const fetchAllEnquiries = async (token) => {
  const response = await fetch(`${API_BASE}/enquiries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized. Please log in again.');
    }
    throw new Error('Failed to fetch enquiries.');
  }

  return response.json();
};

export const updateEnquiryStatus = async (id, status, token) => {
  const response = await fetch(`${API_BASE}/enquiries/${id}?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to update enquiry status.');
  }

  return response.json();
};

export const deleteEnquiry = async (id, token) => {
  const response = await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete enquiry.');
  }

  return response.text();
};
