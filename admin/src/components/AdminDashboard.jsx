import { useState, useEffect } from 'react';
import { fetchAllEnquiries, updateEnquiryStatus, deleteEnquiry } from '../services/api';

function AdminDashboard({ token, onLogout }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const adminEmail = localStorage.getItem('adminEmail') || 'Admin';

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAllEnquiries(token);
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load enquiries');
      if (err.message.includes('Unauthorized')) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [token]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      const updated = await updateEnquiryStatus(id, newStatus, token);
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: updated.status || newStatus } : item))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete enquiry from "${name}"?`)) {
      return;
    }

    try {
      setActionLoadingId(id);
      await deleteEnquiry(id, token);
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete enquiry');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesSearch =
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.destination && item.destination.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.phone && item.phone.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (item.status && item.status.toUpperCase() === statusFilter.toUpperCase());

    return matchesSearch && matchesStatus;
  });

  const totalCount = enquiries.length;
  const pendingCount = enquiries.filter(
    (e) => !e.status || e.status.toUpperCase() === 'PENDING' || e.status.toUpperCase() === 'NEW'
  ).length;
  const contactedCount = enquiries.filter(
    (e) => e.status && (e.status.toUpperCase() === 'CONTACTED' || e.status.toUpperCase() === 'IN_PROGRESS')
  ).length;
  const resolvedCount = enquiries.filter(
    (e) => e.status && (e.status.toUpperCase() === 'COMPLETED' || e.status.toUpperCase() === 'RESOLVED' || e.status.toUpperCase() === 'CONFIRMED')
  ).length;

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="logo-badge">GJ</span>
          <div>
            <h1>GJ Enterprise Admin</h1>
            <span className="subtitle">Enquiries & Bookings Management</span>
          </div>
        </div>

        <div className="header-right">
          <span className="user-pill">{adminEmail}</span>
          <button className="btn btn-secondary" onClick={loadEnquiries} title="Refresh">
            ↻ Refresh
          </button>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Metric Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Total Enquiries</h3>
            <p className="metric-value">{totalCount}</p>
          </div>
          <div className="metric-card metric-pending">
            <h3>Pending</h3>
            <p className="metric-value">{pendingCount}</p>
          </div>
          <div className="metric-card metric-progress">
            <h3>Contacted</h3>
            <p className="metric-value">{contactedCount}</p>
          </div>
          <div className="metric-card metric-resolved">
            <h3>Confirmed / Resolved</h3>
            <p className="metric-value">{resolvedCount}</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="controls-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, phone, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Enquiries Table */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading enquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="empty-state">
            <p>No enquiries found matching your criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="enquiry-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Destination</th>
                  <th>Travel Date</th>
                  <th>Pax</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id}>
                    <td>#{enquiry.id}</td>
                    <td>
                      <div className="client-info">
                        <strong>{enquiry.name}</strong>
                        <span>{enquiry.email}</span>
                        <span>{enquiry.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="destination-tag">{enquiry.destination}</span>
                    </td>
                    <td>{enquiry.travelDate || 'Flexible'}</td>
                    <td>{enquiry.travellers || 1}</td>
                    <td>
                      <p className="message-cell">{enquiry.message || '—'}</p>
                    </td>
                    <td>
                      <select
                        className={`status-badge status-${(enquiry.status || 'PENDING').toLowerCase()}`}
                        value={enquiry.status || 'PENDING'}
                        onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                        disabled={actionLoadingId === enquiry.id}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(enquiry.id, enquiry.name)}
                        disabled={actionLoadingId === enquiry.id}
                        title="Delete Enquiry"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
