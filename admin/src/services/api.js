export const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

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
  const response = await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Failed to update enquiry status.');
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

export const fetchAllPackages = async () => {
  const response = await fetch(`${API_BASE}/packages`);
  if (!response.ok) {
    throw new Error('Failed to fetch packages.');
  }
  return response.json();
};

export const createPackage = async (packageData, token) => {
  const response = await fetch(`${API_BASE}/packages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(packageData),
  });

  if (!response.ok) {
    throw new Error('Failed to create package.');
  }

  return response.json();
};

export const updatePackage = async (id, packageData, token) => {
  const response = await fetch(`${API_BASE}/packages/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(packageData),
  });

  if (!response.ok) {
    throw new Error('Failed to update package.');
  }

  return response.json();
};

export const deletePackage = async (id, token) => {
  const response = await fetch(`${API_BASE}/packages/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete package.');
  }

  return response.text();
};

export const fetchAllBookings = async (token) => {
  const response = await fetch(`${API_BASE}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bookings.');
  }

  return response.json();
};

export const updateBookingStatus = async (id, status, token) => {
  const response = await fetch(`${API_BASE}/bookings/${id}?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to update booking status.');
  }

  return response.json();
};

export const deleteBooking = async (id, token) => {
  const response = await fetch(`${API_BASE}/bookings/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete booking.');
  }

  return response.text();
};

export const assignLead = async (id, employeeId, token) => {
  const response = await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ employeeId: employeeId ? Number(employeeId) : null }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Failed to assign lead.');
  }

  return response.json();
};

export const updateLeadPriority = async (id, priority, token) => {
  const response = await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ priority }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Failed to update priority.');
  }

  return response.json();
};

export const updateLeadNotes = async (id, followUpDate, notes, token) => {
  let url = `${API_BASE}/enquiries/${id}/notes?`;
  if (followUpDate) url += `followUpDate=${encodeURIComponent(followUpDate)}&`;
  if (notes) url += `notes=${encodeURIComponent(notes)}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to update notes.');
  }

  return response.json();
};

export const fetchAllEmployees = async (token) => {
  const response = await fetch(`${API_BASE}/users/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch team members.');
  }

  return response.json();
};

export const createEmployee = async (employeeData, token) => {
  const response = await fetch(`${API_BASE}/users/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    throw new Error('Failed to create team member.');
  }

  return response.json();
};

export const fetchAllPayments = async (token) => {
  const response = await fetch(`${API_BASE}/payments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payments.');
  }

  return response.json();
};

export const recordPayment = async (paymentData, token) => {
  const response = await fetch(`${API_BASE}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Failed to record payment.');
  }

  return response.json();
};

export const refundPayment = async (paymentId, reason, token) => {
  const response = await fetch(`${API_BASE}/payments/${paymentId}/refund`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error('Failed to refund payment.');
  }

  return response.json();
};

export const fetchAllDocuments = async (token) => {
  const response = await fetch(`${API_BASE}/documents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch documents.');
  }

  return response.json();
};

export const verifyDocument = async (docId, status, reason, token) => {
  const response = await fetch(`${API_BASE}/documents/${docId}/verify`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, reason }),
  });

  if (!response.ok) {
    throw new Error('Failed to update document verification status.');
  }

  return response.json();
};

export const uploadAdminDocument = async (docData, bookingId, token) => {
  const response = await fetch(`${API_BASE}/documents/upload${bookingId ? `?bookingId=${bookingId}` : ''}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(docData),
  });

  if (!response.ok) {
    throw new Error('Failed to upload document.');
  }

  return response.json();
};

export const deleteDocumentApi = async (docId, token) => {
  const response = await fetch(`${API_BASE}/documents/${docId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete document.');
  }

  return response.json();
};

export const sendBookingNotification = async (bookingId, email, phone, channel, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/notifications/send-booking-confirmation/${bookingId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, phone, channel }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to dispatch booking notification.');
  }

  return response.json();
};

export const sendPaymentReceiptNotification = async (receiptData, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/notifications/send-payment-receipt`, {
    method: 'POST',
    headers,
    body: JSON.stringify(receiptData),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to dispatch payment notification.');
  }

  return response.json();
};

export const sendQuotationNotification = async (enquiryId, quotationData, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const targetUrl = `${API_BASE}/notifications/send-quotation${enquiryId ? `/${enquiryId}` : ''}`;
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(quotationData),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to dispatch quotation proposal.');
  }

  return response.json();
};

export const fetchNotificationLogs = async (token) => {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/notifications/logs`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notification logs.');
  }

  return response.json();
};



