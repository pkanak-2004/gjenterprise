const API_BASE = '/api';

export const submitEnquiry = async (enquiryData) => {
  const response = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enquiryData),
  });

  if (!response.ok) {
    throw new Error('Failed to submit enquiry');
  }

  return response.json();
};

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
    throw new Error(data.message || 'Invalid credentials');
  }

  return data;
};