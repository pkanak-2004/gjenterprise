import { useState, useEffect } from 'react';
import {
  fetchAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  fetchAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  fetchAllBookings,
  updateBookingStatus,
  deleteBooking,
  fetchAllEmployees,
  createEmployee,
  assignLead,
  updateLeadPriority,
  updateLeadNotes,
  fetchAllPayments,
  recordPayment,
  refundPayment,
  fetchAllDocuments,
  verifyDocument,
  uploadAdminDocument,
  deleteDocumentApi,
  sendBookingNotification,
  sendQuotationNotification,
  fetchNotificationLogs,
} from '../services/api';

function AdminDashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('LEADS'); // 'LEADS', 'PACKAGES', 'BOOKINGS', 'PAYMENTS', 'DOCUMENTS', 'TEAM'
  
  // Notification Modal State
  const [notifyModalBooking, setNotifyModalBooking] = useState(null);
  const [notifyChannel, setNotifyChannel] = useState('BOTH'); // 'BOTH', 'EMAIL', 'SMS'
  const [notifyCustomEmail, setNotifyCustomEmail] = useState('');
  const [notifyCustomPhone, setNotifyCustomPhone] = useState('');
  const [notifyStatusMsg, setNotifyStatusMsg] = useState('');

  // Enquiries State
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Packages State
  const [packages, setPackages] = useState([]);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageFormData, setPackageFormData] = useState({
    destination: '',
    title: '',
    description: '',
    duration: '',
    price: '',
    imageUrl: '',
    category: 'Family',
    inclusions: 'Hotel, Daily Breakfast, Transfers, Sightseeing',
    exclusions: 'Flights, Personal Shopping',
    itinerary: 'Day 1: Arrival | Day 2: Sightseeing | Day 3: Adventure | Day 4: Departure',
  });

  // Bookings State
  const [bookings, setBookings] = useState([]);

  // Documents & Vault State
  const [documents, setDocuments] = useState([]);
  const [documentFilter, setDocumentFilter] = useState('ALL');
  const [documentCategoryFilter, setDocumentCategoryFilter] = useState('ALL');
  const [documentSearch, setDocumentSearch] = useState('');
  const [adminUploadModalOpen, setAdminUploadModalOpen] = useState(false);
  const [previewAdminDoc, setPreviewAdminDoc] = useState(null);
  const [adminDocFormData, setAdminDocFormData] = useState({
    bookingId: '',
    fileName: '',
    documentCategory: 'FLIGHT_TICKET',
    fileSize: '',
    fileType: 'application/pdf',
    fileData: '',
    customerName: '',
    customerEmail: '',
    bookingReference: '',
  });

  // Payments State
  const [payments, setPayments] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL');
  const [recordPaymentModalOpen, setRecordPaymentModalOpen] = useState(false);
  const [manualPaymentData, setManualPaymentData] = useState({
    bookingId: '',
    amount: '',
    paymentMethod: 'UPI',
    transactionId: '',
    notes: '',
  });

  // Employees & CRM State
  const [employees, setEmployees] = useState([]);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'EMPLOYEE',
  });

  const adminEmail = localStorage.getItem('adminEmail') || 'Admin';

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError('');
      const [enquiryData, employeeData] = await Promise.all([
        fetchAllEnquiries(token),
        fetchAllEmployees(token).catch(() => []),
      ]);
      setEnquiries(Array.isArray(enquiryData) ? enquiryData : []);
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
    } catch (err) {
      setError(err.message || 'Failed to load enquiries');
      if (err.message.includes('Unauthorized')) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAllPackages();
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAllBookings(token);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError('');
      const [paymentData, bookingData] = await Promise.all([
        fetchAllPayments(token),
        fetchAllBookings(token).catch(() => []),
      ]);
      setPayments(Array.isArray(paymentData) ? paymentData : []);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAllEmployees(token);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const [docsData, bookingsData] = await Promise.all([
        fetchAllDocuments(token),
        fetchAllBookings(token).catch(() => []),
      ]);
      setDocuments(Array.isArray(docsData) ? docsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'LEADS') {
      loadEnquiries();
    } else if (activeTab === 'PACKAGES') {
      loadPackages();
    } else if (activeTab === 'BOOKINGS') {
      loadBookings();
    } else if (activeTab === 'PAYMENTS') {
      loadPayments();
    } else if (activeTab === 'DOCUMENTS') {
      loadDocuments();
    } else if (activeTab === 'TEAM') {
      loadEmployees();
    }
  }, [activeTab, token]);

  const handleVerifyDocumentAction = async (docId, status, reason = '') => {
    try {
      setActionLoadingId(`DOC_VERIFY_${docId}`);
      await verifyDocument(docId, status, reason, token);
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, verificationStatus: status, rejectionReason: reason || null } : d))
      );
      alert(`✓ Document status updated to: ${status}`);
    } catch (err) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAdminFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAdminDocFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        fileSize: sizeStr,
        fileData: ev.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdminUploadSubmit = async (e) => {
    e.preventDefault();
    if (!adminDocFormData.fileName || !adminDocFormData.fileData) {
      alert('Please choose a file to upload.');
      return;
    }

    try {
      setActionLoadingId('ADMIN_DOC_UPLOAD');
      const selectedB = bookings.find((b) => String(b.id) === String(adminDocFormData.bookingId));
      
      const payload = {
        fileName: adminDocFormData.fileName,
        fileType: adminDocFormData.fileType,
        documentCategory: adminDocFormData.documentCategory,
        fileSize: adminDocFormData.fileSize || '1.5 MB',
        fileData: adminDocFormData.fileData,
        bookingReference: selectedB?.bookingReference || `GJE-${adminDocFormData.bookingId}`,
        customerName: selectedB?.customerName || 'Rahul Sharma',
        customerEmail: selectedB?.customerEmail || 'customer@gjenterprise.com',
        uploadedByRole: 'ADMIN',
        verificationStatus: 'VERIFIED',
      };

      const saved = await uploadAdminDocument(payload, adminDocFormData.bookingId, token);
      setDocuments((prev) => [saved, ...prev]);
      setAdminUploadModalOpen(false);
      setAdminDocFormData({
        bookingId: '',
        fileName: '',
        documentCategory: 'FLIGHT_TICKET',
        fileSize: '',
        fileType: 'application/pdf',
        fileData: '',
        customerName: '',
        customerEmail: '',
        bookingReference: '',
      });
      alert('🎉 Official travel document / ticket successfully uploaded for the customer!');
    } catch (err) {
      alert(err.message || 'Failed to upload document');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteDocAction = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      setActionLoadingId(`DOC_DEL_${docId}`);
      await deleteDocumentApi(docId, token);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      alert('Document deleted.');
    } catch (err) {
      alert(err.message || 'Failed to delete document');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDownloadAdminDoc = (doc) => {
    if (doc.fileData && doc.fileData.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.fileName || 'Travel_Document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`⬇️ Downloading document: ${doc.fileName}`);
    }
  };

  const handleRecordManualPayment = async (e) => {
    e.preventDefault();
    try {
      setActionLoadingId('MANUAL_PAY');
      await recordPayment(
        {
          bookingId: Number(manualPaymentData.bookingId),
          amount: Number(manualPaymentData.amount),
          paymentMethod: manualPaymentData.paymentMethod,
          transactionId: manualPaymentData.transactionId || `OFFLINE-${Date.now() % 1000000}`,
          notes: manualPaymentData.notes || 'Recorded manually by admin',
          status: 'SUCCESS',
        },
        token
      );
      alert('Payment recorded successfully! Booking advance and status have been updated.');
      setRecordPaymentModalOpen(false);
      setManualPaymentData({ bookingId: '', amount: '', paymentMethod: 'UPI', transactionId: '', notes: '' });
      loadPayments();
    } catch (err) {
      alert(err.message || 'Failed to record payment');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRefundPaymentAction = async (paymentId) => {
    const reason = prompt('Please enter the reason for this refund:');
    if (!reason) return;

    try {
      setActionLoadingId(paymentId);
      await refundPayment(paymentId, reason, token);
      alert('Payment has been successfully marked as REFUNDED.');
      loadPayments();
    } catch (err) {
      alert(err.message || 'Failed to process refund');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePrintGstInvoice = (payment) => {
    const printWindow = window.open('', '_blank');
    const booking = payment.booking || {};
    const invoiceNum = `INV-2026-${payment.id || Math.floor(Math.random() * 9000 + 1000)}`;
    const invoiceDate = payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    const amount = Number(payment.amount || 0);
    const baseAmount = (amount / 1.05).toFixed(2);
    const gstAmount = (amount - baseAmount).toFixed(2);
    const cgst = (gstAmount / 2).toFixed(2);
    const sgst = (gstAmount / 2).toFixed(2);

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice - ${invoiceNum} - GJ Enterprise</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; padding: 40px; margin: 0; }
          .invoice-box { max-width: 800px; margin: 0 auto; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 24px; }
          .logo-title { font-size: 26px; font-weight: 900; color: #1e3a8a; }
          .logo-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
          .inv-badge { background: #eff6ff; color: #1e3a8a; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 13px; text-transform: uppercase; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 28px; font-size: 14px; }
          .section-h { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 1px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { background: #f8fafc; text-align: left; padding: 12px; font-size: 13px; font-weight: 800; border-bottom: 2px solid #e2e8f0; color: #1e3a8a; }
          td { padding: 14px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
          .totals-table { width: 320px; margin-left: auto; font-size: 14px; }
          .totals-table td { padding: 8px 12px; }
          .total-row { font-size: 16px; font-weight: 900; color: #1e3a8a; border-top: 2px solid #1e3a8a; }
          .stamp-box { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
          .seal { border: 2px dashed #16a34a; color: #16a34a; padding: 10px 20px; border-radius: 8px; font-weight: 900; text-transform: uppercase; font-size: 13px; }
          .btn-print { background: #1e3a8a; color: #fff; padding: 10px 24px; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; margin-bottom: 20px; }
          @media print { .btn-print { display: none; } }
        </style>
      </head>
      <body>
        <div style="text-align: right; max-width: 800px; margin: 0 auto 10px;">
          <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
        </div>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="logo-title">GJ ENTERPRISE</div>
              <div class="logo-sub">Bespoke Travel Solutions & Luxury Holidays</div>
              <div style="font-size: 12px; color: #475569; margin-top: 6px;">GSTIN: <strong>09AAACG1234F1Z5</strong> | PAN: <strong>AAACG1234F</strong><br/>Greater Noida, Uttar Pradesh, India - 201310</div>
            </div>
            <div style="text-align: right;">
              <div class="inv-badge">Tax Invoice / Receipt</div>
              <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 10px;">${invoiceNum}</div>
              <div style="font-size: 13px; color: #64748b;">Date: ${invoiceDate}</div>
            </div>
          </div>

          <div class="details-grid">
            <div>
              <div class="section-h">Billed To (Customer)</div>
              <div style="font-weight: 800; font-size: 16px;">${booking.customerName || 'Valued Guest'}</div>
              <div style="color: #475569; margin-top: 4px;">Email: ${booking.customerEmail || 'N/A'}<br/>Phone: ${booking.customerPhone || 'N/A'}</div>
            </div>
            <div>
              <div class="section-h">Booking Reference</div>
              <div style="font-weight: 800; font-size: 15px;">#${booking.bookingReference || booking.id || 'N/A'}</div>
              <div style="color: #475569; margin-top: 4px;">Destination: <strong>${booking.destination || 'Custom Tour'}</strong><br/>Travel Date: ${booking.travelDate || 'As per itinerary'} | Guests: ${booking.numberOfTravelers || 2}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item / Description</th>
                <th>HSN / SAC</th>
                <th>Payment Mode</th>
                <th>Txn ID</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Holiday Package Advance Booking</strong><br/><small style="color: #64748b;">${booking.destination || 'Travel Package'} - ${payment.notes || 'Payment Received'}</small></td>
                <td>998555</td>
                <td><span style="background: #f1f5f9; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 12px;">${payment.paymentMethod || 'UPI'}</span></td>
                <td><code>${payment.transactionId || 'N/A'}</code></td>
                <td style="text-align: right; font-weight: 800;">₹${amount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Taxable Value:</td>
              <td style="text-align: right; font-weight: 600;">₹${Number(baseAmount).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>CGST (2.5%):</td>
              <td style="text-align: right; font-weight: 600;">₹${Number(cgst).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>SGST (2.5%):</td>
              <td style="text-align: right; font-weight: 600;">₹${Number(sgst).toLocaleString('en-IN')}</td>
            </tr>
            <tr class="total-row">
              <td>Total Paid:</td>
              <td style="text-align: right;">₹${amount.toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <div class="stamp-box">
            <div>
              <div class="seal">✓ PAID & VERIFIED</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Computer generated receipt. No physical signature required.</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; font-size: 14px; color: #1e3a8a;">For GJ ENTERPRISE</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 25px;">Authorized Signatory</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  const handlePrintQuotation = (enquiry) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download or print your official Tour Quotation Proposal.");
      return;
    }

    const quoteNum = `QT-2026-LEAD${enquiry.id || "01"}`;
    const quoteDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const validUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const estPersons = Number(enquiry.travellers || 2);
    const estPricePerPerson = 28500;
    const subtotal = estPersons * estPricePerPerson;
    const gstVal = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + gstVal;

    const quoteHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bespoke Holiday Proposal &amp; Quotation - ${quoteNum} - GJ Enterprise</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; padding: 40px; margin: 0; background: #fff; line-height: 1.5; }
          .quote-box { max-width: 820px; margin: 0 auto; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 24px; }
          .logo-title { font-size: 26px; font-weight: 900; color: #1e3a8a; }
          .logo-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
          .quote-badge { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 13px; text-transform: uppercase; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 28px; font-size: 14px; }
          .section-h { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 1px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { background: #f8fafc; text-align: left; padding: 12px; font-size: 13px; font-weight: 800; border-bottom: 2px solid #e2e8f0; color: #1e3a8a; }
          td { padding: 14px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
          .totals-table { width: 340px; margin-left: auto; font-size: 14px; margin-bottom: 20px; }
          .totals-table td { padding: 8px 12px; }
          .total-row { font-size: 16px; font-weight: 900; color: #1e3a8a; border-top: 2px solid #1e3a8a; }
          .terms-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; font-size: 12px; color: #475569; margin-bottom: 24px; }
          .stamp-box { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          .seal { border: 2px dashed #1e3a8a; color: #1e3a8a; background: #eff6ff; padding: 10px 20px; border-radius: 8px; font-weight: 900; text-transform: uppercase; font-size: 13px; }
          .btn-print { background: #1e3a8a; color: #fff; padding: 10px 24px; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; margin-bottom: 20px; }
          @media print { .btn-print { display: none; } }
        </style>
      </head>
      <body>
        <div style="text-align: right; max-width: 820px; margin: 0 auto 10px;">
          <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
        </div>
        <div class="quote-box">
          <div class="header">
            <div>
              <div class="logo-title">GJ ENTERPRISE LUXURY TRAVEL</div>
              <div class="logo-sub">Bespoke Holiday Proposals &amp; VIP Tour Planning</div>
              <div style="font-size: 12px; color: #475569; margin-top: 6px;">
                GSTIN: <strong>09AAACG1234F1Z5</strong> | PAN: <strong>AAACG1234F</strong><br/>
                Greater Noida, Uttar Pradesh, India - 201310 | Contact: +91 98765 43210
              </div>
            </div>
            <div style="text-align: right;">
              <div class="quote-badge">Official Tour Quotation</div>
              <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 10px;">${quoteNum}</div>
              <div style="font-size: 13px; color: #64748b;">Issued: ${quoteDate}</div>
              <div style="font-size: 12px; color: #166534; font-weight: 800; margin-top: 4px;">Valid Until: ${validUntil}</div>
            </div>
          </div>

          <div class="details-grid">
            <div>
              <div class="section-h">Quotation Prepared For</div>
              <div style="font-weight: 800; font-size: 16px;">${enquiry.name || "Valued Lead"}</div>
              <div style="color: #475569; margin-top: 4px;">
                Email: ${enquiry.email || "N/A"}<br/>
                Phone: ${enquiry.phone || "N/A"}
              </div>
            </div>
            <div>
              <div class="section-h">Requested Itinerary &amp; Destination</div>
              <div style="font-weight: 800; font-size: 15px; color: #1e3a8a;">${enquiry.destination || "Custom Vacation"}</div>
              <div style="color: #475569; margin-top: 4px;">
                Service Tier: <strong>${enquiry.service || "Luxury Package"}</strong><br/>
                Travel Date: <strong>${enquiry.travelDate || "Flexible"}</strong> | Guests: <strong>${estPersons} Persons</strong>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Component / Deliverable</th>
                <th>Category</th>
                <th>Qty</th>
                <th style="text-align: right;">Est. Cost (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Premium 4-Star / 5-Star Resort Stays</strong><br/>
                  <small style="color: #64748b;">Sanitized luxury rooms, daily breakfast &amp; dinner buffet included</small>
                </td>
                <td>Stays</td>
                <td>${estPersons} Guests</td>
                <td style="text-align: right; font-weight: 700;">₹${Math.round(subtotal * 0.5).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td>
                  <strong>Private Dedicated AC Cab &amp; Airport Meet-and-Greet</strong><br/>
                  <small style="color: #64748b;">AC Sedan / SUV with commercial permit, fuel, toll, and verified driver</small>
                </td>
                <td>Logistics</td>
                <td>1 Private Vehicle</td>
                <td style="text-align: right; font-weight: 700;">₹${Math.round(subtotal * 0.3).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td>
                  <strong>Sightseeing Pass, Guided Excursions &amp; 24/7 SOS Concierge</strong><br/>
                  <small style="color: #64748b;">Entry permits, priority attraction passes, complimentary insurance</small>
                </td>
                <td>Experiences</td>
                <td>All Inclusive</td>
                <td style="text-align: right; font-weight: 700;">₹${Math.round(subtotal * 0.2).toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Package Subtotal:</td>
              <td style="text-align: right; font-weight: 600;">₹${subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td>GST (5% Tourism SAC 998555):</td>
              <td style="text-align: right; font-weight: 600;">₹${gstVal.toLocaleString("en-IN")}</td>
            </tr>
            <tr class="total-row">
              <td>Total Estimated Tour Cost:</td>
              <td style="text-align: right;">₹${grandTotal.toLocaleString("en-IN")}</td>
            </tr>
          </table>

          <div class="terms-box">
            <strong>📋 Booking Terms &amp; Conditions:</strong>
            <ul style="margin: 4px 0 0; padding-left: 18px;">
              <li>Pay 20% advance token to confirm bookings and lock current hotel rates.</li>
              <li>Remaining balance due 7 days prior to tour commencement.</li>
              <li>100% transparent pricing backed by GJ Enterprise Quality Guarantee.</li>
            </ul>
          </div>

          <div class="stamp-box">
            <div>
              <div class="seal">✓ OFFICIAL GJ PROPOSAL</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Computer generated estimate quotation. Valid for 15 days from issue date.</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; font-size: 14px; color: #1e3a8a;">For GJ ENTERPRISE</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 25px;">Sales &amp; Holiday Operations Desk</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(quoteHtml);
    printWindow.document.close();
  };

  const handleOpenNotifyModal = (booking) => {
    setNotifyModalBooking(booking);
    setNotifyChannel('BOTH');
    setNotifyCustomEmail(booking.customerEmail || 'customer@gjenterprise.com');
    setNotifyCustomPhone(booking.customerPhone || '+91 9876543299');
    setNotifyStatusMsg('');
  };

  const handleDispatchBookingNotification = async (e) => {
    e.preventDefault();
    if (!notifyModalBooking) return;
    try {
      setActionLoadingId('DISPATCH_NOTIFY');
      setNotifyStatusMsg('Sending notification via ' + notifyChannel + '...');
      const res = await sendBookingNotification(
        notifyModalBooking.id,
        notifyCustomEmail,
        notifyCustomPhone,
        notifyChannel,
        token
      );
      setNotifyStatusMsg('🎉 ' + res.message);
      setTimeout(() => {
        setNotifyModalBooking(null);
        setNotifyStatusMsg('');
      }, 1800);
    } catch (err) {
      setNotifyStatusMsg('❌ Error: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSendProposalNotification = async (enquiry) => {
    try {
      setActionLoadingId(`PROPOSAL_NOTIFY_${enquiry.id}`);
      const payload = {
        name: enquiry.name || 'Valued Lead',
        email: enquiry.email || 'customer@gjenterprise.com',
        phone: enquiry.phone || '+91 9876543299',
        destination: enquiry.destination || 'Custom Holiday',
      };
      await sendQuotationNotification(enquiry.id, payload, token);
      alert(`🎉 Proposal Notification (Email & SMS) successfully sent to ${payload.email} and ${payload.phone}!`);
    } catch (err) {
      alert(err.message || 'Failed to dispatch proposal notification');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAssignLead = async (leadId, employeeId) => {
    try {
      setActionLoadingId(leadId);
      const updated = await assignLead(leadId, employeeId ? Number(employeeId) : null, token);
      setEnquiries((prev) =>
        prev.map((item) => (item.id === leadId ? { ...item, assignedTo: updated.assignedTo } : item))
      );
    } catch (err) {
      alert(err.message || 'Failed to assign lead');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePriorityChange = async (leadId, priority) => {
    try {
      setActionLoadingId(leadId);
      const updated = await updateLeadPriority(leadId, priority, token);
      setEnquiries((prev) =>
        prev.map((item) => (item.id === leadId ? { ...item, priority: updated.priority } : item))
      );
    } catch (err) {
      alert(err.message || 'Failed to update priority');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(employeeFormData, token);
      alert('Team member added successfully!');
      setEmployeeModalOpen(false);
      setEmployeeFormData({ name: '', email: '', phone: '', password: '', role: 'EMPLOYEE' });
      loadEmployees();
    } catch (err) {
      alert(err.message || 'Failed to add team member');
    }
  };

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

  // Package Actions
  const handleOpenAddPackage = () => {
    setEditingPackage(null);
    setPackageFormData({
      destination: '',
      title: '',
      description: '',
      duration: '4 Days / 3 Nights',
      price: '',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      category: 'Family',
      inclusions: '4-Star Hotel, Daily Breakfast & Dinner, AC Transfers, Guided Sightseeing',
      exclusions: 'Flights, Personal Expenses, Travel Insurance',
      itinerary: 'Day 1: Arrival & Check-in | Day 2: City Sightseeing | Day 3: Leisure & Adventure | Day 4: Departure',
    });
    setPackageModalOpen(true);
  };

  const handleOpenEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageFormData({
      destination: pkg.destination || '',
      title: pkg.title || '',
      description: pkg.description || '',
      duration: pkg.duration || '',
      price: pkg.price || '',
      imageUrl: pkg.imageUrl || '',
      category: pkg.category || 'Family',
      inclusions: pkg.inclusions || '',
      exclusions: pkg.exclusions || '',
      itinerary: pkg.itinerary || '',
    });
    setPackageModalOpen(true);
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await updatePackage(editingPackage.id, packageFormData, token);
        alert('Package updated successfully!');
      } else {
        await createPackage(packageFormData, token);
        alert('New package created successfully!');
      }
      setPackageModalOpen(false);
      loadPackages();
    } catch (err) {
      alert(err.message || 'Failed to save package');
    }
  };

  const handleDeletePackage = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete package "${name}"?`)) {
      return;
    }
    try {
      await deletePackage(id, token);
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete package');
    }
  };

  // Booking Actions
  const handleBookingStatusChange = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      const updated = await updateBookingStatus(id, newStatus, token);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: updated.status || newStatus } : b))
      );
    } catch (err) {
      alert(err.message || 'Failed to update booking status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteBooking = async (id, ref) => {
    if (!window.confirm(`Are you sure you want to delete booking "${ref}"?`)) {
      return;
    }
    try {
      setActionLoadingId(id);
      await deleteBooking(id, token);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete booking');
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
      (item.service && item.service.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.phone && item.phone.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (item.status && item.status.toUpperCase() === statusFilter.toUpperCase());

    return matchesSearch && matchesStatus;
  });

  // Filtered payments
  const filteredPayments = payments.filter((pay) => {
    const b = pay.booking || {};
    const matchesSearch =
      !paymentSearch ||
      (pay.transactionId && pay.transactionId.toLowerCase().includes(paymentSearch.toLowerCase())) ||
      (b.customerName && b.customerName.toLowerCase().includes(paymentSearch.toLowerCase())) ||
      (b.bookingReference && b.bookingReference.toLowerCase().includes(paymentSearch.toLowerCase())) ||
      (b.destination && b.destination.toLowerCase().includes(paymentSearch.toLowerCase()));

    const matchesStatus =
      paymentFilter === 'ALL' ||
      (pay.status && pay.status.toUpperCase() === paymentFilter.toUpperCase());

    const matchesMethod =
      paymentMethodFilter === 'ALL' ||
      (pay.paymentMethod && pay.paymentMethod.toUpperCase() === paymentMethodFilter.toUpperCase());

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalCount = enquiries.length;
  const pendingCount = enquiries.filter(
    (e) => !e.status || e.status.toUpperCase() === 'PENDING' || e.status.toUpperCase() === 'NEW'
  ).length;
  const contactedCount = enquiries.filter(
    (e) => e.status && (e.status.toUpperCase() === 'CONTACTED' || e.status.toUpperCase() === 'FOLLOW_UP')
  ).length;
  const resolvedCount = enquiries.filter(
    (e) => e.status && (e.status.toUpperCase() === 'COMPLETED' || e.status.toUpperCase() === 'CONFIRMED' || e.status.toUpperCase() === 'BOOKED')
  ).length;

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="logo-badge">GJ</span>
          <div>
            <h1>GJ Enterprise Admin</h1>
            <span className="subtitle">Enquiries, Packages, Bookings & CRM</span>
          </div>
        </div>

        <div className="header-right">
          <span className="user-pill">{adminEmail}</span>
          <button
            className="btn btn-secondary"
            onClick={
              activeTab === 'LEADS'
                ? loadEnquiries
                : activeTab === 'PACKAGES'
                ? loadPackages
                : activeTab === 'BOOKINGS'
                ? loadBookings
                : activeTab === 'PAYMENTS'
                ? loadPayments
                : loadEmployees
            }
            title="Refresh"
          >
            ↻ Refresh
          </button>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '12px', padding: '16px 30px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('LEADS')}
          style={{
            padding: '10px 22px',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'LEADS' ? '#1e3a8a' : '#ffffff',
            color: activeTab === 'LEADS' ? '#ffffff' : '#475569',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}
        >
          📌 Enquiries & Leads ({enquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('PACKAGES')}
          style={{
            padding: '10px 22px',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'PACKAGES' ? '#1e3a8a' : '#ffffff',
            color: activeTab === 'PACKAGES' ? '#ffffff' : '#475569',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}
        >
          ✈️ Tour Packages ({packages.length})
        </button>

        <button
          onClick={() => setActiveTab('BOOKINGS')}
          style={{
            padding: '10px 22px',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'BOOKINGS' ? '#1e3a8a' : '#ffffff',
            color: activeTab === 'BOOKINGS' ? '#ffffff' : '#475569',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}
        >
          🎫 Customer Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('PAYMENTS')}
          style={{
            padding: '10px 22px',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'PAYMENTS' ? '#1e3a8a' : '#ffffff',
            color: activeTab === 'PAYMENTS' ? '#ffffff' : '#475569',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}
        >
          💳 Payments & Invoices ({payments.length})
        </button>

        <button
          onClick={() => setActiveTab('DOCUMENTS')}
          style={{
            padding: '10px 22px',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'DOCUMENTS' ? '#1e3a8a' : '#ffffff',
            color: activeTab === 'DOCUMENTS' ? '#ffffff' : '#475569',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}
        >
          📁 Document Vault & KYC ({documents.length})
        </button>

        <button
          onClick={() => setActiveTab('TEAM')}
          style={{
            padding: '10px 22px',
            borderRadius: '25px',
            border: 'none',
            background: activeTab === 'TEAM' ? '#1e3a8a' : '#ffffff',
            color: activeTab === 'TEAM' ? '#ffffff' : '#475569',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}
        >
          👥 Sales Team & Staff ({employees.length})
        </button>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'LEADS' ? (
          <>
            {/* Metric Cards */}
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Total Enquiries</h3>
                <p className="metric-value">{totalCount}</p>
              </div>
              <div className="metric-card metric-pending">
                <h3>New / Pending</h3>
                <p className="metric-value">{pendingCount}</p>
              </div>
              <div className="metric-card metric-progress">
                <h3>Contacted</h3>
                <p className="metric-value">{contactedCount}</p>
              </div>
              <div className="metric-card metric-resolved">
                <h3>Booked / Confirmed</h3>
                <p className="metric-value">{resolvedCount}</p>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="controls-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, email, phone, service, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New / Pending</option>
                <option value="CONTACTED">Contacted</option>
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="BOOKED">Booked</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
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
                      <th>Destination & Service</th>
                      <th>Priority</th>
                      <th>Assigned Agent</th>
                      <th>Travel Date</th>
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
                          <span className="destination-tag">{enquiry.destination || '—'}</span>
                          {enquiry.service && (
                            <div style={{ marginTop: '4px', fontSize: '11px', color: '#1e3a8a', fontWeight: '600' }}>
                              📦 {enquiry.service}
                            </div>
                          )}
                        </td>
                        <td>
                          <select
                            value={enquiry.priority || 'MEDIUM'}
                            onChange={(e) => handlePriorityChange(enquiry.id, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12px',
                              fontWeight: '700',
                              background: enquiry.priority === 'HIGH' ? '#fee2e2' : enquiry.priority === 'LOW' ? '#f1f5f9' : '#fef3c7',
                              color: enquiry.priority === 'HIGH' ? '#991b1b' : enquiry.priority === 'LOW' ? '#475569' : '#92400e',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="HIGH">🔥 High</option>
                            <option value="MEDIUM">⚡ Medium</option>
                            <option value="LOW">🌱 Low</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={enquiry.assignedTo?.id || ''}
                            onChange={(e) => handleAssignLead(enquiry.id, e.target.value)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12px',
                              maxWidth: '140px',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">👤 Unassigned</option>
                            {employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                {emp.name || emp.email}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>{enquiry.travelDate || 'Flexible'}</td>
                        <td>
                          <select
                            className={`status-badge status-${(enquiry.status || 'NEW').toLowerCase()}`}
                            value={enquiry.status || 'NEW'}
                            onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                            disabled={actionLoadingId === enquiry.id}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="FOLLOW_UP">FOLLOW UP</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="BOOKED">BOOKED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handlePrintQuotation(enquiry)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #bfdbfe',
                                background: '#eff6ff',
                                color: '#1e3a8a',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Generate Official PDF Quotation Proposal"
                            >
                              📄 Quotation PDF
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSendProposalNotification(enquiry)}
                              disabled={actionLoadingId === `PROPOSAL_NOTIFY_${enquiry.id}`}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #86efac',
                                background: '#dcfce7',
                                color: '#166534',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Send Proposal Notification via Email & SMS"
                            >
                              {actionLoadingId === `PROPOSAL_NOTIFY_${enquiry.id}` ? 'Sending...' : '📧 Send Email/SMS'}
                            </button>

                            <button
                              className="btn btn-delete"
                              onClick={() => handleDelete(enquiry.id, enquiry.name)}
                              disabled={actionLoadingId === enquiry.id}
                              title="Delete Enquiry"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : activeTab === 'PACKAGES' ? (
          /* Packages Management Tab */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2>Tour Packages ({packages.length})</h2>
                <p style={{ color: '#64748b', margin: '4px 0 0' }}>Manage tour packages, pricing, itineraries, and inclusions</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleOpenAddPackage}
                style={{ background: '#1e3a8a', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}
              >
                ➕ Add New Package
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading packages...</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="empty-state">
                <p>No packages found in database.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="enquiry-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Destination & Title</th>
                      <th>Duration</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.id}>
                        <td>
                          <img
                            src={pkg.imageUrl}
                            alt={pkg.destination}
                            style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        </td>
                        <td>
                          <strong>{pkg.destination}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{pkg.title}</div>
                        </td>
                        <td>{pkg.duration}</td>
                        <td>
                          <span className="destination-tag">{pkg.category || 'Standard'}</span>
                        </td>
                        <td>
                          <strong style={{ color: '#1e3a8a' }}>₹{Number(pkg.price || 0).toLocaleString('en-IN')}</strong>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenEditPackage(pkg)}
                              style={{ padding: '6px 12px', background: '#eff6ff', color: '#1e3a8a', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-delete"
                              onClick={() => handleDeletePackage(pkg.id, pkg.destination)}
                              style={{ padding: '6px 12px' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === 'BOOKINGS' ? (
          /* Bookings Management Tab */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2>Customer Bookings ({bookings.length})</h2>
                <p style={{ color: '#64748b', margin: '4px 0 0' }}>Manage customer package bookings, payment statuses and travel confirmations</p>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="empty-state">
                <p>No customer bookings placed yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="enquiry-table">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Customer</th>
                      <th>Package & Destination</th>
                      <th>Travel Date</th>
                      <th>Travellers</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <strong style={{ color: '#1e3a8a', letterSpacing: '0.5px' }}>#{booking.bookingReference || booking.id}</strong>
                        </td>
                        <td>
                          <div className="client-info">
                            <strong>{booking.customerName || booking.customer?.name || 'Customer'}</strong>
                            <span>{booking.customerEmail || booking.customer?.email}</span>
                            <span>{booking.customerPhone || booking.customer?.phone}</span>
                          </div>
                        </td>
                        <td>
                          <span className="destination-tag">{booking.tourPackage?.destination || 'Custom Trip'}</span>
                          {booking.tourPackage?.title && (
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              {booking.tourPackage.title}
                            </div>
                          )}
                        </td>
                        <td>{booking.travelDate || 'Flexible'}</td>
                        <td>
                          {booking.adultsCount || 1} Adults
                          {booking.childrenCount > 0 ? `, ${booking.childrenCount} Kids` : ''}
                        </td>
                        <td>
                          <strong style={{ color: '#15803d', fontSize: '15px' }}>
                            ₹{Number(booking.totalPrice || 0).toLocaleString('en-IN')}
                          </strong>
                        </td>
                        <td>
                          <select
                            className={`status-badge status-${(booking.status || 'PENDING').toLowerCase()}`}
                            value={booking.status || 'PENDING'}
                            onChange={(e) => handleBookingStatusChange(booking.id, e.target.value)}
                            disabled={actionLoadingId === booking.id}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenNotifyModal(booking)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #86efac',
                                background: '#dcfce7',
                                color: '#166534',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Send Confirmation Email & SMS to Customer"
                            >
                              📧 Send Email / SMS
                            </button>

                            <button
                              className="btn btn-delete"
                              onClick={() => handleDeleteBooking(booking.id, booking.bookingReference)}
                              disabled={actionLoadingId === booking.id}
                              title="Delete Booking"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === 'TEAM' ? (
          /* Team & Staff Management Tab */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2>Sales Team & Staff ({employees.length})</h2>
                <p style={{ color: '#64748b', margin: '4px 0 0' }}>Manage sales agents, assign incoming travel enquiries, and monitor CRM activity</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setEmployeeModalOpen(true)}
                style={{ background: '#1e3a8a', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}
              >
                ➕ Add Team Member
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading team members...</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="empty-state">
                <p>No team members found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="enquiry-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td>#{emp.id}</td>
                        <td>
                          <strong>{emp.name || 'Staff Member'}</strong>
                        </td>
                        <td>{emp.email}</td>
                        <td>{emp.phone || '—'}</td>
                        <td>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '700',
                            background: emp.role === 'ADMIN' ? '#eff6ff' : '#ecfdf5',
                            color: emp.role === 'ADMIN' ? '#1e3a8a' : '#047857'
                          }}>
                            {emp.role || 'EMPLOYEE'}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '13px' }}>● Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === 'PAYMENTS' ? (
          <div>
            {/* Payment KPIs */}
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Total Revenue Collected</h3>
                <p className="metric-value" style={{ color: '#16a34a' }}>
                  ₹{payments
                    .filter((p) => p.status === 'SUCCESS')
                    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
                    .toLocaleString('en-IN')}
                </p>
              </div>
              <div className="metric-card metric-resolved">
                <h3>Successful Transactions</h3>
                <p className="metric-value">
                  {payments.filter((p) => p.status === 'SUCCESS').length}
                </p>
              </div>
              <div className="metric-card metric-pending">
                <h3>Refunds Processed</h3>
                <p className="metric-value" style={{ color: '#ef4444' }}>
                  ₹{payments
                    .filter((p) => p.status === 'REFUNDED')
                    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
                    .toLocaleString('en-IN')}
                </p>
              </div>
              <div className="metric-card metric-progress">
                <h3>Avg Transaction Value</h3>
                <p className="metric-value">
                  ₹{payments.filter((p) => p.status === 'SUCCESS').length > 0
                    ? Math.round(
                        payments
                          .filter((p) => p.status === 'SUCCESS')
                          .reduce((sum, p) => sum + Number(p.amount || 0), 0) /
                          payments.filter((p) => p.status === 'SUCCESS').length
                      ).toLocaleString('en-IN')
                    : 0}
                </p>
              </div>
            </div>

            {/* Action & Filter Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '24px 0 16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  💳 Payments, Invoices &amp; Financial Ledger
                </h2>
                <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '13px' }}>
                  Live record of customer advance deposits, online payments, and GST tax invoices
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setRecordPaymentModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>➕</span> Record Offline / Manual Payment
              </button>
            </div>

            {/* Search & Filter Toolbar */}
            <div style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              background: '#f8fafc',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <input
                  type="text"
                  placeholder="🔍 Search by Txn ID, customer name or booking ref..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Status:</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUCCESS">Success (Paid)</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Method:</label>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="ALL">All Methods</option>
                  <option value="UPI">UPI (GPay / PhonePe)</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="NET_BANKING">Net Banking</option>
                  <option value="BANK_TRANSFER">Bank Transfer / IMPS</option>
                  <option value="CASH">Cash / Offline</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading payments &amp; financial records...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="empty-state">
                <p>No payment transactions found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="enquiry-table">
                  <thead>
                    <tr>
                      <th>Txn ID &amp; Date</th>
                      <th>Booking Ref &amp; Tour</th>
                      <th>Customer</th>
                      <th>Amount Paid</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Tax Invoice &amp; Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((pay) => {
                      const isSuccess = pay.status === 'SUCCESS';
                      const isRefunded = pay.status === 'REFUNDED';
                      const b = pay.booking || {};

                      return (
                        <tr key={pay.id}>
                          <td>
                            <strong><code>{pay.transactionId || `TXN-${pay.id}`}</code></strong>
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                              🕒 {pay.paymentDate ? new Date(pay.paymentDate).toLocaleString('en-IN') : 'Recent'}
                            </div>
                          </td>
                          <td>
                            <strong>#{b.bookingReference || b.id || 'N/A'}</strong>
                            <div style={{ fontSize: '12px', color: '#1e3a8a', fontWeight: '700' }}>
                              📍 {b.destination || 'Custom Package'}
                            </div>
                          </td>
                          <td>
                            <strong>{b.customerName || 'Valued Guest'}</strong>
                            <div style={{ fontSize: '11.5px', color: '#64748b' }}>{b.customerEmail || b.customerPhone || '—'}</div>
                          </td>
                          <td>
                            <strong style={{ fontSize: '15px', color: isSuccess ? '#16a34a' : '#64748b' }}>
                              ₹{Number(pay.amount || 0).toLocaleString('en-IN')}
                            </strong>
                          </td>
                          <td>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '11.5px',
                              fontWeight: '800',
                              background: '#f1f5f9',
                              color: '#334155'
                            }}>
                              {pay.paymentMethod || 'UPI'}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '11.5px',
                              fontWeight: '800',
                              background: isSuccess ? '#dcfce7' : isRefunded ? '#fee2e2' : '#fef3c7',
                              color: isSuccess ? '#166534' : isRefunded ? '#991b1b' : '#92400e'
                            }}>
                              {pay.status || 'SUCCESS'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handlePrintGstInvoice(pay)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #bfdbfe',
                                  background: '#eff6ff',
                                  color: '#1e3a8a',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                                title="Print Official GST Tax Invoice"
                              >
                                🖨️ GST Invoice
                              </button>

                              {isSuccess && (
                                <button
                                  onClick={() => handleRefundPaymentAction(pay.id)}
                                  disabled={actionLoadingId === pay.id}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #fecaca',
                                    background: '#fef2f2',
                                    color: '#b91c1c',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                  }}
                                  title="Process Refund"
                                >
                                  {actionLoadingId === pay.id ? '...' : 'Refund 🔄'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === 'DOCUMENTS' ? (
          <div>
            {/* Documents Top Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Travel Documents</span>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#1e3a8a', marginTop: '4px' }}>{documents.length}</div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '700', textTransform: 'uppercase' }}>Pending Review (KYC)</span>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#d97706', marginTop: '4px' }}>
                  {documents.filter((d) => d.verificationStatus === 'PENDING_REVIEW').length}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>Verified &amp; Approved</span>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#16a34a', marginTop: '4px' }}>
                  {documents.filter((d) => d.verificationStatus === 'VERIFIED').length}
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: '700', textTransform: 'uppercase' }}>Action Required / Rejected</span>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#dc2626', marginTop: '4px' }}>
                  {documents.filter((d) => d.verificationStatus === 'REJECTED').length}
                </div>
              </div>
            </div>

            {/* Filter & Action Controls */}
            <div style={{
              background: '#ffffff', padding: '18px 22px', borderRadius: '14px', border: '1px solid #e2e8f0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
                <input
                  type="text"
                  placeholder="🔍 Search Customer, Booking Ref, File..."
                  value={documentSearch}
                  onChange={(e) => setDocumentSearch(e.target.value)}
                  style={{ minWidth: '260px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                />

                <select
                  value={documentFilter}
                  onChange={(e) => setDocumentFilter(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', background: '#fff' }}
                >
                  <option value="ALL">All Verification Statuses</option>
                  <option value="PENDING_REVIEW">⏳ Pending Review</option>
                  <option value="VERIFIED">✓ Verified</option>
                  <option value="REJECTED">❌ Rejected</option>
                </select>

                <select
                  value={documentCategoryFilter}
                  onChange={(e) => setDocumentCategoryFilter(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', background: '#fff' }}
                >
                  <option value="ALL">All Document Types</option>
                  <option value="PASSPORT">🛂 Passports</option>
                  <option value="AADHAAR_ID">🪪 Govt Photo IDs</option>
                  <option value="FLIGHT_TICKET">✈️ Flight Tickets</option>
                  <option value="HOTEL_VOUCHER">🏨 Hotel Vouchers</option>
                  <option value="TRAVEL_INSURANCE">🛡️ Insurance</option>
                </select>
              </div>

              <button
                onClick={() => setAdminUploadModalOpen(true)}
                style={{
                  padding: '11px 22px', borderRadius: '8px', border: 'none',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', color: '#fff',
                  fontWeight: '800', fontSize: '13.5px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
                }}
              >
                + Upload Ticket / Voucher for Customer 📤
              </button>
            </div>

            {/* Documents Table */}
            {(() => {
              const filtered = documents.filter((doc) => {
                const matchesSearch =
                  !documentSearch ||
                  (doc.fileName && doc.fileName.toLowerCase().includes(documentSearch.toLowerCase())) ||
                  (doc.customerName && doc.customerName.toLowerCase().includes(documentSearch.toLowerCase())) ||
                  (doc.customerEmail && doc.customerEmail.toLowerCase().includes(documentSearch.toLowerCase())) ||
                  (doc.bookingReference && doc.bookingReference.toLowerCase().includes(documentSearch.toLowerCase()));

                const matchesStatus =
                  documentFilter === 'ALL' ||
                  (doc.verificationStatus && doc.verificationStatus.toUpperCase() === documentFilter.toUpperCase());

                const matchesCategory =
                  documentCategoryFilter === 'ALL' ||
                  (doc.documentCategory && doc.documentCategory.toUpperCase() === documentCategoryFilter.toUpperCase());

                return matchesSearch && matchesStatus && matchesCategory;
              });

              if (filtered.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                    <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>📁</span>
                    <h3 style={{ margin: '0 0 6px', color: '#1e3a8a' }}>No travel documents found</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                      Try changing your search keywords or upload a new ticket/voucher.
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '14px', fontSize: '12px', textTransform: 'uppercase', color: '#475569', fontWeight: '800' }}>Document</th>
                        <th style={{ padding: '14px', fontSize: '12px', textTransform: 'uppercase', color: '#475569', fontWeight: '800' }}>Customer</th>
                        <th style={{ padding: '14px', fontSize: '12px', textTransform: 'uppercase', color: '#475569', fontWeight: '800' }}>Booking Ref</th>
                        <th style={{ padding: '14px', fontSize: '12px', textTransform: 'uppercase', color: '#475569', fontWeight: '800' }}>Category</th>
                        <th style={{ padding: '14px', fontSize: '12px', textTransform: 'uppercase', color: '#475569', fontWeight: '800' }}>Uploaded By</th>
                        <th style={{ padding: '14px', fontSize: '12px', textTransform: 'uppercase', color: '#475569', fontWeight: '800' }}>Status</th>
                        <th style={{ padding: '14px', fontSize: '12px', textTransform: 'uppercase', color: '#475569', fontWeight: '800' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((doc) => {
                        const isVerified = doc.verificationStatus === 'VERIFIED';
                        const isRejected = doc.verificationStatus === 'REJECTED';
                        const isPdf = doc.fileType?.includes('pdf') || doc.fileName?.endsWith('.pdf');

                        return (
                          <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '20px' }}>{isPdf ? '📄' : '🖼️'}</span>
                                <div>
                                  <strong style={{ fontSize: '13.5px', color: '#0f172a', display: 'block' }}>{doc.fileName}</strong>
                                  <span style={{ fontSize: '11.5px', color: '#64748b' }}>{doc.fileSize || '1.2 MB'} • {new Date(doc.uploadDate || Date.now()).toLocaleDateString('en-IN')}</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <strong style={{ fontSize: '13.5px', display: 'block' }}>{doc.customerName || 'Rahul Sharma'}</strong>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>{doc.customerEmail || 'customer@gjenterprise.com'}</span>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span style={{ background: '#eff6ff', color: '#1e3a8a', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>
                                #{doc.bookingReference || 'GJE-KSH-8821'}
                              </span>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span style={{ background: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '800' }}>
                                {doc.documentCategory?.replace('_', ' ')}
                              </span>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '700', color: doc.uploadedByRole === 'ADMIN' ? '#1e3a8a' : '#475569' }}>
                                {doc.uploadedByRole === 'ADMIN' ? '🏢 GJ Admin' : '👤 Customer'}
                              </span>
                            </td>
                            <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <select
                                  value={doc.verificationStatus || 'PENDING_REVIEW'}
                                  onChange={(e) => {
                                    const newStatus = e.target.value;
                                    if (newStatus === 'REJECTED') {
                                      const reason = window.prompt('Please enter the reason for rejection / re-upload:', doc.rejectionReason || '');
                                      if (reason !== null) {
                                        handleVerifyDocumentAction(doc.id, 'REJECTED', reason);
                                      }
                                    } else {
                                      handleVerifyDocumentAction(doc.id, newStatus);
                                    }
                                  }}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11.5px',
                                    fontWeight: '800',
                                    border: isVerified ? '1.5px solid #86efac' : isRejected ? '1.5px solid #fca5a5' : '1.5px solid #fde68a',
                                    background: isVerified ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                                    color: isVerified ? '#166534' : isRejected ? '#991b1b' : '#92400e',
                                    cursor: 'pointer',
                                    outline: 'none',
                                  }}
                                >
                                  <option value="VERIFIED">✓ VERIFIED</option>
                                  <option value="PENDING_REVIEW">⏳ PENDING</option>
                                  <option value="REJECTED">❌ REJECTED</option>
                                </select>
                                {doc.rejectionReason && (
                                  <div style={{ fontSize: '11px', color: '#dc2626', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.rejectionReason}>
                                    Note: {doc.rejectionReason}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                  onClick={() => handleVerifyDocumentAction(doc.id, 'VERIFIED')}
                                  disabled={actionLoadingId === `DOC_VERIFY_${doc.id}`}
                                  style={{
                                    padding: '6px 11px',
                                    borderRadius: '6px',
                                    border: isVerified ? '1.5px solid #16a34a' : '1px solid #86efac',
                                    background: isVerified ? '#16a34a' : '#dcfce7',
                                    color: isVerified ? '#ffffff' : '#166534',
                                    fontSize: '11.5px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    boxShadow: isVerified ? '0 2px 6px rgba(22, 163, 74, 0.25)' : 'none',
                                    transition: 'all 0.2s ease',
                                  }}
                                  title={isVerified ? "Document is Approved & Verified" : "Click to Approve Document"}
                                >
                                  {isVerified ? "✓ Approved" : "✓ Approve"}
                                </button>

                                <button
                                  onClick={() => {
                                    const reason = window.prompt('Please enter the reason for rejection / re-upload:', doc.rejectionReason || 'Document unclear, please re-upload');
                                    if (reason !== null) {
                                      handleVerifyDocumentAction(doc.id, 'REJECTED', reason);
                                    }
                                  }}
                                  disabled={actionLoadingId === `DOC_VERIFY_${doc.id}`}
                                  style={{
                                    padding: '6px 11px',
                                    borderRadius: '6px',
                                    border: isRejected ? '1.5px solid #dc2626' : '1px solid #fecaca',
                                    background: isRejected ? '#dc2626' : '#fef2f2',
                                    color: isRejected ? '#ffffff' : '#b91c1c',
                                    fontSize: '11.5px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    boxShadow: isRejected ? '0 2px 6px rgba(220, 38, 38, 0.25)' : 'none',
                                    transition: 'all 0.2s ease',
                                  }}
                                  title={isRejected ? "Document is Rejected" : "Click to Reject with Reason"}
                                >
                                  {isRejected ? "❌ Rejected" : "❌ Reject"}
                                </button>

                                <button
                                  onClick={() => setPreviewAdminDoc(doc)}
                                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1e3a8a', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
                                  title="Preview Document"
                                >
                                  👁️
                                </button>

                                <button
                                  onClick={() => handleDownloadAdminDoc(doc)}
                                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
                                  title="Download Document"
                                >
                                  ⬇️
                                </button>

                                <button
                                  onClick={() => handleDeleteDocAction(doc.id)}
                                  disabled={actionLoadingId === `DOC_DEL_${doc.id}`}
                                  style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', color: '#ef4444', fontSize: '11.5px', cursor: 'pointer' }}
                                  title="Delete Document"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        ) : null}
      </main>

      {/* Record Manual Payment Modal */}
      {recordPaymentModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '14px', maxWidth: '520px', width: '100%',
            padding: '28px 24px', position: 'relative'
          }}>
            <button
              onClick={() => setRecordPaymentModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>

            <h3 style={{ margin: '0 0 16px', color: '#1e3a8a' }}>💳 Record Offline / Manual Payment</h3>

            <form onSubmit={handleRecordManualPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Select Booking *</label>
                <select
                  required
                  value={manualPaymentData.bookingId}
                  onChange={(e) => setManualPaymentData({ ...manualPaymentData, bookingId: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Choose Customer Booking --</option>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      #{b.bookingReference || b.id} - {b.customerName} ({b.destination}) - Total: ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')} (Advance: ₹{Number(b.advancePaid || 0).toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Amount Received (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10000"
                    value={manualPaymentData.amount}
                    onChange={(e) => setManualPaymentData({ ...manualPaymentData, amount: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Payment Mode *</label>
                  <select
                    value={manualPaymentData.paymentMethod}
                    onChange={(e) => setManualPaymentData({ ...manualPaymentData, paymentMethod: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="UPI">Google Pay / PhonePe (UPI)</option>
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="NET_BANKING">Net Banking</option>
                    <option value="BANK_TRANSFER">Bank Transfer (IMPS/NEFT)</option>
                    <option value="CASH">Cash at Office</option>
                    <option value="CHEQUE">Bank Cheque / DD</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Transaction ID / Ref #</label>
                <input
                  type="text"
                  placeholder="e.g. UPI-123456789 or CHQ-00981"
                  value={manualPaymentData.transactionId}
                  onChange={(e) => setManualPaymentData({ ...manualPaymentData, transactionId: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Notes / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Received 50% advance token via office counter"
                  value={manualPaymentData.notes}
                  onChange={(e) => setManualPaymentData({ ...manualPaymentData, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={actionLoadingId === 'MANUAL_PAY'}
                  style={{ flex: 1, padding: '12px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {actionLoadingId === 'MANUAL_PAY' ? 'Recording...' : 'Record Payment & Confirm'}
                </button>
                <button
                  type="button"
                  onClick={() => setRecordPaymentModalOpen(false)}
                  style={{ padding: '12px 20px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {employeeModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '14px', maxWidth: '480px', width: '100%',
            padding: '28px 24px', position: 'relative'
          }}>
            <button
              onClick={() => setEmployeeModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>

            <h3 style={{ margin: '0 0 16px', color: '#1e3a8a' }}>➕ Add Sales Agent / Team Member</h3>

            <form onSubmit={handleSaveEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={employeeFormData.name}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram@gjenterprise.com"
                  value={employeeFormData.email}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={employeeFormData.phone}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Login Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={employeeFormData.password}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, password: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Agent
                </button>
                <button
                  type="button"
                  onClick={() => setEmployeeModalOpen(false)}
                  style={{ padding: '12px 20px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Package Modal */}
      {packageModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '14px', maxWidth: '600px', width: '100%',
            maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative'
          }}>
            <button
              onClick={() => setPackageModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>

            <h3 style={{ margin: '0 0 16px', color: '#1e3a8a' }}>
              {editingPackage ? '✏️ Edit Tour Package' : '➕ Add New Tour Package'}
            </h3>

            <form onSubmit={handleSavePackage} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Destination Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa, Manali, Dubai"
                  value={packageFormData.destination}
                  onChange={(e) => setPackageFormData({ ...packageFormData, destination: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Package Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Beach Holiday Experience"
                  value={packageFormData.title}
                  onChange={(e) => setPackageFormData({ ...packageFormData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Days / 4 Nights"
                    value={packageFormData.duration}
                    onChange={(e) => setPackageFormData({ ...packageFormData, duration: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 14999"
                    value={packageFormData.price}
                    onChange={(e) => setPackageFormData({ ...packageFormData, price: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Category</label>
                <select
                  value={packageFormData.category}
                  onChange={(e) => setPackageFormData({ ...packageFormData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Family">Family</option>
                  <option value="Honeymoon">Honeymoon</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Weekend">Weekend Gateway</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={packageFormData.imageUrl}
                  onChange={(e) => setPackageFormData({ ...packageFormData, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows="2"
                  placeholder="Brief overview of the trip..."
                  value={packageFormData.description}
                  onChange={(e) => setPackageFormData({ ...packageFormData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Inclusions (comma separated)</label>
                <input
                  type="text"
                  value={packageFormData.inclusions}
                  onChange={(e) => setPackageFormData({ ...packageFormData, inclusions: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Day-by-Day Itinerary (use | to separate days)</label>
                <textarea
                  rows="3"
                  value={packageFormData.itinerary}
                  onChange={(e) => setPackageFormData({ ...packageFormData, itinerary: e.target.value })}
                  placeholder="Day 1: Arrival & Check-in | Day 2: City Tour | Day 3: Adventure & Beach | Day 4: Departure"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
                <button
                  type="button"
                  onClick={() => setPackageModalOpen(false)}
                  style={{ padding: '12px 20px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Upload Document / Voucher Modal */}
      {adminUploadModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '16px', maxWidth: '540px', width: '100%',
            padding: '28px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <button
              onClick={() => setAdminUploadModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>

            <span style={{ background: '#eff6ff', color: '#1e3a8a', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
              🏢 OFFICIAL TRAVEL ISSUANCE
            </span>
            <h3 style={{ margin: '8px 0 4px', color: '#1e3a8a' }}>Upload Ticket / Voucher for Customer</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
              The uploaded file will be directly delivered to the customer's Travel Vault.
            </p>

            <form onSubmit={handleAdminUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Select Customer Booking *</label>
                <select
                  required
                  value={adminDocFormData.bookingId}
                  onChange={(e) => setAdminDocFormData({ ...adminDocFormData, bookingId: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', background: '#f8fafc' }}
                >
                  <option value="">-- Choose Booking to Attach --</option>
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      #{b.bookingReference || b.id} - {b.customerName} ({b.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Document Category *</label>
                <select
                  value={adminDocFormData.documentCategory}
                  onChange={(e) => setAdminDocFormData({ ...adminDocFormData, documentCategory: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', background: '#f8fafc' }}
                >
                  <option value="FLIGHT_TICKET">✈️ Flight E-Ticket / Boarding Pass</option>
                  <option value="HOTEL_VOUCHER">🏨 Hotel Stay Confirmation Voucher</option>
                  <option value="VISA">📄 Visa Approval Letter / e-Visa</option>
                  <option value="TRAVEL_INSURANCE">🛡️ Travel Insurance Policy</option>
                  <option value="OTHER">📁 Sightseeing / Cab Service Voucher</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Attach File (PDF, JPG, PNG) *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleAdminFileChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px dashed #3b82f6', background: '#eff6ff' }}
                />
                {adminDocFormData.fileName && (
                  <div style={{ fontSize: '12px', color: '#166534', marginTop: '6px', fontWeight: '700' }}>
                    ✓ Selected: {adminDocFormData.fileName} ({adminDocFormData.fileSize})
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={actionLoadingId === 'ADMIN_DOC_UPLOAD'}
                  style={{ flex: 1, padding: '12px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
                >
                  {actionLoadingId === 'ADMIN_DOC_UPLOAD' ? 'Uploading...' : 'Upload & Deliver to Customer 🚀'}
                </button>
                <button
                  type="button"
                  onClick={() => setAdminUploadModalOpen(false)}
                  style={{ padding: '12px 20px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Document Preview Modal */}
      {previewAdminDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '16px', maxWidth: '640px', width: '100%',
            padding: '28px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <button
              onClick={() => setPreviewAdminDoc(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>

            <h3 style={{ margin: '0 0 4px', color: '#1e3a8a' }}>{previewAdminDoc.fileName}</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
              Category: <strong>{previewAdminDoc.documentCategory}</strong> • Customer: <strong>{previewAdminDoc.customerName}</strong> (#{previewAdminDoc.bookingReference})
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', textAlign: 'center', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              {previewAdminDoc.fileData && previewAdminDoc.fileData.startsWith('data:image') ? (
                <img src={previewAdminDoc.fileData} alt={previewAdminDoc.fileName} style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain' }} />
              ) : (
                <div>
                  <span style={{ fontSize: '50px', display: 'block', marginBottom: '8px' }}>📄</span>
                  <strong style={{ fontSize: '16px', color: '#0f172a' }}>{previewAdminDoc.fileName}</strong>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>File Size: {previewAdminDoc.fileSize || '1.2 MB'}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleDownloadAdminDoc(previewAdminDoc)}
                style={{ flex: 1, padding: '11px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
              >
                ⬇️ Download File
              </button>
              <button
                onClick={() => setPreviewAdminDoc(null)}
                style={{ padding: '11px 20px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Confirmation Email & SMS Modal */}
      {notifyModalBooking && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '18px', maxWidth: '560px', width: '100%',
            padding: '30px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <button
              onClick={() => setNotifyModalBooking(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>

            <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
              ⚡ REAL-TIME CUSTOMER NOTIFICATION
            </span>
            <h3 style={{ margin: '8px 0 4px', color: '#1e3a8a' }}>Send Booking Confirmation &amp; Voucher</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
              Dispatch branded Email voucher and instant SMS/WhatsApp alert for <strong>Booking #{notifyModalBooking.bookingReference || notifyModalBooking.id}</strong>.
            </p>

            <form onSubmit={handleDispatchBookingNotification} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Select Notification Channel *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { key: 'BOTH', label: '⚡ Both Email & SMS' },
                    { key: 'EMAIL', label: '📧 Email Only' },
                    { key: 'SMS', label: '📱 SMS Only' },
                  ].map((ch) => (
                    <button
                      key={ch.key}
                      type="button"
                      onClick={() => setNotifyChannel(ch.key)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '8px',
                        border: notifyChannel === ch.key ? '2px solid #1e3a8a' : '1px solid #cbd5e1',
                        background: notifyChannel === ch.key ? '#eff6ff' : '#ffffff',
                        color: notifyChannel === ch.key ? '#1e3a8a' : '#475569',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Customer Email Address *</label>
                <input
                  type="email"
                  required={notifyChannel === 'EMAIL' || notifyChannel === 'BOTH'}
                  value={notifyCustomEmail}
                  onChange={(e) => setNotifyCustomEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', background: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Customer Phone Number (for SMS &amp; WhatsApp) *</label>
                <input
                  type="tel"
                  required={notifyChannel === 'SMS' || notifyChannel === 'BOTH'}
                  value={notifyCustomPhone}
                  onChange={(e) => setNotifyCustomPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', background: '#f8fafc' }}
                />
              </div>

              {/* Message Live Preview Box */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', fontSize: '12px' }}>
                <div style={{ fontWeight: '700', color: '#1e3a8a', marginBottom: '4px' }}>📱 SMS Preview:</div>
                <div style={{ color: '#475569', fontStyle: 'italic' }}>
                  "✨ GJ ENTERPRISE: Booking #{notifyModalBooking.bookingReference || notifyModalBooking.id} to {notifyModalBooking.tourPackage?.destination || notifyModalBooking.destination} is CONFIRMED for {notifyModalBooking.customerName || 'Rahul Sharma'}! Advance ₹{Number(notifyModalBooking.advancePaid || 15000).toLocaleString('en-IN')} received. Concierge Helpline: +91 98765 43210"
                </div>
              </div>

              {notifyStatusMsg && (
                <div style={{
                  padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '700',
                  background: notifyStatusMsg.startsWith('❌') ? '#fee2e2' : '#f0fdf4',
                  color: notifyStatusMsg.startsWith('❌') ? '#991b1b' : '#166534',
                  border: notifyStatusMsg.startsWith('❌') ? '1px solid #fca5a5' : '1px solid #bbf7d0'
                }}>
                  {notifyStatusMsg}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={actionLoadingId === 'DISPATCH_NOTIFY'}
                  style={{ flex: 1, padding: '12px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}
                >
                  {actionLoadingId === 'DISPATCH_NOTIFY' ? 'Dispatching...' : 'Dispatch Email & SMS Now 🚀'}
                </button>
                <button
                  type="button"
                  onClick={() => setNotifyModalBooking(null)}
                  style={{ padding: '12px 20px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
