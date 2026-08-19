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