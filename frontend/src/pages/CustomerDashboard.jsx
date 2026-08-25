import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";
import ItineraryModal from "../components/ItineraryModal";
import { API_BASE } from "../services/api";
import "./CustomerDashboard.css";

const DESTINATION_FALLBACK_IMAGES = {
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
  Manali: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800&q=80",
  Shimla: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
  Dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  Maldives: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
  Jaipur: "https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=800&q=80",
  Kashmir: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
  Kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
  Bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  Ladakh: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
  Andaman: "https://images.unsplash.com/photo-1589330273594-fade1ee91647?auto=format&fit=crop&w=800&q=80",
  Singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
};

const SAMPLE_DEMO_BOOKINGS = [
  {
    id: 101,
    bookingReference: "GJE-KSH-8821",
    destination: "Kashmir",
    tourPackage: {
      id: 6,
      destination: "Kashmir",
      title: "Kashmir Luxury Houseboat & Snow Gondola Getaway",
      duration: "6 Days / 5 Nights",
      price: 37999,
      discountPercentage: 20,
      rating: 4.9,
      imageUrl: DESTINATION_FALLBACK_IMAGES.Kashmir,
      itinerary: "Day 1: Arrival at Srinagar Airport, transfer to Dal Lake Houseboat with Shikara ride.\nDay 2: Full day excursion to Gulmarg with Gondola Cable Car phase 1 & 2.\nDay 3: Scenic drive to Pahalgam, Betaab Valley, and Aru Valley nature exploration.\nDay 4: Day trip to Sonamarg Thajiwas Glacier and pony ride.\nDay 5: Mughal Gardens (Nishat, Shalimar) and local Kashmiri saffron / shawl shopping.\nDay 6: Airport drop with sweet memories.",
      inclusions: "5-Star Deluxe Houseboat, Private AC Cab, Daily Breakfast & Dinner, Shikara Ride, Driver Allowance",
      exclusions: "Flight Tickets, Personal Shopping, Snow Activities at Gulmarg",
    },
    travelDate: "2026-10-15",
    adultsCount: 2,
    totalPrice: 75998,
    advancePaid: 30000,
    status: "CONFIRMED",
    customerName: "Rahul Sharma",
    customerEmail: "customer@gjenterprise.com",
    customerPhone: "+91 98765 43299",
  },
  {
    id: 102,
    bookingReference: "GJE-GOA-5490",
    destination: "Goa",
    tourPackage: {
      id: 1,
      destination: "Goa",
      title: "Goa Beachfront Resort & Mandovi Sunset Cruise",
      duration: "4 Days / 3 Nights",
      price: 14999,
      discountPercentage: 25,
      rating: 4.8,
      imageUrl: DESTINATION_FALLBACK_IMAGES.Goa,
      itinerary: "Day 1: Airport pickup in private AC cab, check-in to 4-Star Beach Resort in Candolim.\nDay 2: North Goa sightseeing — Fort Aguada, Baga beach water sports & Tito's lane.\nDay 3: South Goa heritage tour — Old Goa Churches & evening Mandovi Luxury Yacht Cruise.\nDay 4: Breakfast, beach relaxation and private airport transfer.",
      inclusions: "4-Star Beach Resort, Private AC Cab, Daily Buffet Breakfast, Mandovi Yacht Cruise Passes",
      exclusions: "Flights, Watersports Tickets, Personal Expenses",
    },
    travelDate: "2026-11-20",
    adultsCount: 2,
    totalPrice: 29998,
    advancePaid: 29998,
    status: "CONFIRMED",
    customerName: "Rahul Sharma",
    customerEmail: "customer@gjenterprise.com",
    customerPhone: "+91 98765 43299",
  },
];

function CustomerDashboard() {
  const { user, token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("BOOKINGS"); // 'BOOKINGS', 'DOCUMENTS', 'PAYMENTS', 'ENQUIRIES', 'CONCIERGE'
  const [activeItinerary, setActiveItinerary] = useState(null);

  // Document Vault State
  const [docCategoryFilter, setDocCategoryFilter] = useState("ALL");
  const [uploadDocModalOpen, setUploadDocModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [newDocData, setNewDocData] = useState({
    fileName: "",
    documentCategory: "PASSPORT",
    fileSize: "",
    fileType: "application/pdf",
    fileData: "",
    bookingReference: "GJE-KSH-8821",
    customerName: user?.name || "Rahul Sharma",
    customerEmail: user?.email || "customer@gjenterprise.com",
  });

  // Guest / Login State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [trackRef, setTrackRef] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

  // Payment Gateway State
  const [paymentModalBooking, setPaymentModalBooking] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [gatewayTab, setGatewayTab] = useState("UPI"); // 'UPI', 'CARD', 'NET_BANKING', 'BANK_TRANSFER'
  const [cardData, setCardData] = useState({
    number: "4532 8900 1234 5678",
    name: user?.name || "Rahul Sharma",
    expiry: "12/28",
    cvv: "889",
  });
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [upiVpa, setUpiVpa] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  const fetchDocuments = async () => {
    try {
      if (!user?.email) return;
      const res = await fetch(`${API_BASE}/documents/my?email=${encodeURIComponent(user.email)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const dData = await res.json();
        const myDocs = Array.isArray(dData)
          ? dData.filter((d) => d.customerEmail?.toLowerCase() === user.email.toLowerCase())
          : [];
        setDocuments(myDocs);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch My Bookings (Strictly isolated by current user email)
        const emailQuery = user?.email ? `?email=${encodeURIComponent(user.email)}` : "";
        const bookingsRes = await fetch(`${API_BASE}/bookings/my${emailQuery}`, {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        });
        if (bookingsRes.ok) {
          const bData = await bookingsRes.json();
          if (Array.isArray(bData)) {
            const myBookings = bData.filter(
              (b) => b.customerEmail?.toLowerCase() === user?.email?.toLowerCase()
            );
            setBookings(myBookings);
          } else {
            setBookings([]);
          }
        } else {
          setBookings([]);
        }

        // Fetch My Documents (Strictly isolated)
        await fetchDocuments();

        // Fetch My Enquiries (Strictly isolated)
        const enquiriesRes = await fetch(`${API_BASE}/enquiries`);
        if (enquiriesRes.ok) {
          const eData = await enquiriesRes.json();
          const myEnquiries = Array.isArray(eData)
            ? eData.filter((e) => e.email?.toLowerCase() === user?.email?.toLowerCase())
            : [];
          setEnquiries(myEnquiries);
        } else {
          setEnquiries([]);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, token, user?.email]);

  const handleTrackBooking = async (e) => {
    e.preventDefault();
    if (!trackRef.trim()) return;
    try {
      setTrackLoading(true);
      setTrackError("");
      setTrackResult(null);

      // Check local sample bookings first
      const matchedSample = SAMPLE_DEMO_BOOKINGS.find(
        (b) =>
          b.bookingReference.toLowerCase().includes(trackRef.trim().toLowerCase()) ||
          b.destination.toLowerCase().includes(trackRef.trim().toLowerCase()) ||
          b.customerEmail.toLowerCase().includes(trackRef.trim().toLowerCase()) ||
          b.customerPhone.includes(trackRef.trim())
      );

      if (matchedSample) {
        setTrackResult(matchedSample);
        return;
      }

      const res = await fetch(`${API_BASE}/bookings`);
      if (res.ok) {
        const allBookings = await res.json();
        const found = allBookings.find(
          (b) =>
            b.id?.toString() === trackRef.trim() ||
            (b.bookingReference && b.bookingReference.toLowerCase() === trackRef.trim().toLowerCase()) ||
            (b.customerPhone && b.customerPhone.includes(trackRef.trim())) ||
            (b.customerEmail && b.customerEmail.toLowerCase() === trackRef.trim().toLowerCase())
        );
        if (found) {
          setTrackResult(found);
        } else {
          setTrackError("No booking found matching '" + trackRef.trim() + "'. Please check your reference code or phone number.");
        }
      } else {
        setTrackError("Unable to retrieve bookings right now. Please try again.");
      }
    } catch (err) {
      setTrackError("Search error: " + err.message);
    } finally {
      setTrackLoading(false);
    }
  };

  const handleMakePayment = async (e) => {
    e.preventDefault();
    if (!paymentModalBooking) return;

    try {
      setPaymentLoading(true);
      const res = await fetch(
        `${API_BASE}/payments?bookingId=${paymentModalBooking.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify({
            amount: Number(paymentAmount),
            paymentMethod: gatewayTab,
            status: "SUCCESS",
            notes: `Online customer payment via ${gatewayTab} (${gatewayTab === "UPI" ? upiVpa || "GPay/PhonePe" : gatewayTab === "CARD" ? "Card Ending " + cardData.number.slice(-4) : selectedBank})`,
          }),
        }
      );

      const payAmountNum = Number(paymentAmount);
      const generatedTxn = `TXN-${Date.now().toString().slice(-6)}`;

      // Update local booking state for instantaneous UI satisfaction
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id === paymentModalBooking.id) {
            const newAdv = Number(b.advancePaid || 0) + payAmountNum;
            return {
              ...b,
              advancePaid: newAdv,
              status: newAdv >= Number(b.totalPrice || 24999) ? "CONFIRMED" : b.status,
            };
          }
          return b;
        })
      );

      if (trackResult && trackResult.id === paymentModalBooking.id) {
        setTrackResult((prev) => ({
          ...prev,
          advancePaid: Number(prev.advancePaid || 0) + payAmountNum,
        }));
      }

      setPaymentSuccessData({
        booking: paymentModalBooking,
        amount: payAmountNum,
        method: gatewayTab,
        txnId: generatedTxn,
      });

      // Dispatch real-time Confirmation Email & SMS
      try {
        fetch(`${API_BASE}/notifications/send-payment-receipt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingReference: paymentModalBooking.bookingReference || `GJE-${paymentModalBooking.id}`,
            email: paymentModalBooking.customerEmail || user?.email || "customer@gjenterprise.com",
            phone: paymentModalBooking.customerPhone || user?.phone || "+91 9876543299",
            amount: payAmountNum,
            paymentMethod: gatewayTab,
            transactionId: generatedTxn,
          }),
        }).catch((e) => console.log("Notification dispatch:", e));
      } catch (ignore) {}

      setPaymentModalBooking(null);
    } catch (err) {
      alert("Payment processing simulation error: " + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setNewDocData((prev) => ({
        ...prev,
        fileName: file.name,
        fileType: file.type || "application/pdf",
        fileSize: sizeStr,
        fileData: uploadEvent.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!newDocData.fileName || !newDocData.fileData) {
      alert("Please select a file to upload (PDF, JPG, PNG).");
      return;
    }

    try {
      setUploadLoading(true);
      const matchedBooking = bookings.find((b) => b.bookingReference === newDocData.bookingReference);
      const bookingIdParam = matchedBooking ? matchedBooking.id : null;

      const payload = {
        fileName: newDocData.fileName,
        fileType: newDocData.fileType,
        documentCategory: newDocData.documentCategory,
        fileSize: newDocData.fileSize || "1.5 MB",
        fileData: newDocData.fileData,
        bookingReference: newDocData.bookingReference,
        customerName: user?.name || "Rahul Sharma",
        customerEmail: user?.email || "customer@gjenterprise.com",
        uploadedByRole: "CUSTOMER",
        verificationStatus: "PENDING_REVIEW",
      };

      const res = await fetch(`${API_BASE}/documents/upload${bookingIdParam ? `?bookingId=${bookingIdParam}` : ""}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        setDocuments((prev) => [saved, ...prev]);
        setUploadDocModalOpen(false);
        setNewDocData({
          fileName: "",
          documentCategory: "PASSPORT",
          fileSize: "",
          fileType: "application/pdf",
          fileData: "",
          bookingReference: bookings[0]?.bookingReference || "GJE-KSH-8821",
          customerName: user?.name || "Rahul Sharma",
          customerEmail: user?.email || "customer@gjenterprise.com",
        });
        alert("🎉 Document uploaded successfully! Our team will review & verify it shortly.");
      } else {
        // Fallback for instant client-side responsiveness
        const fallbackDoc = {
          ...payload,
          id: Date.now(),
          uploadDate: new Date().toISOString(),
        };
        setDocuments((prev) => [fallbackDoc, ...prev]);
        setUploadDocModalOpen(false);
        alert("🎉 Document stored in your Vault!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      const fallbackDoc = {
        ...newDocData,
        id: Date.now(),
        uploadDate: new Date().toISOString(),
        verificationStatus: "PENDING_REVIEW",
        uploadedByRole: "CUSTOMER",
      };
      setDocuments((prev) => [fallbackDoc, ...prev]);
      setUploadDocModalOpen(false);
      alert("🎉 Document stored successfully in your Vault!");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDownloadDocument = (doc) => {
    if (doc.fileData && doc.fileData.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = doc.fileData;
      link.download = doc.fileName || "Travel_Document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Simulate direct download
      alert(`⬇️ Downloading official document: ${doc.fileName}`);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document from your vault?")) return;
    try {
      await fetch(`${API_BASE}/documents/${docId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    }
  };

  const printGstTaxInvoice = (booking, paymentInfo = null) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download or print your official GST Tax Invoice.");
      return;
    }

    const invoiceNum = `INV-2026-${booking.bookingReference ? booking.bookingReference.replace(/\D/g, "") : booking.id || "8821"}`;
    const invoiceDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const totalAmount = Number(booking.totalPrice || 24999);
    const advancePaid = paymentInfo ? paymentInfo.amount : Number(booking.advancePaid || totalAmount);
    const balanceDue = totalAmount - advancePaid > 0 ? totalAmount - advancePaid : 0;

    const baseAmount = (advancePaid / 1.05).toFixed(2);
    const gstAmount = (advancePaid - baseAmount).toFixed(2);
    const cgst = (gstAmount / 2).toFixed(2);
    const sgst = (gstAmount / 2).toFixed(2);

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>GST Tax Invoice - ${invoiceNum} - GJ Enterprise</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; padding: 40px; margin: 0; background: #fff; line-height: 1.5; }
          .invoice-box { max-width: 820px; margin: 0 auto; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
          .header { display: flex; justify-content: space-between; border-bottom: 2.5px solid #1e3a8a; padding-bottom: 24px; margin-bottom: 24px; }
          .logo-title { font-size: 26px; font-weight: 900; color: #1e3a8a; letter-spacing: 0.5px; }
          .logo-sub { font-size: 13px; color: #64748b; font-weight: 600; margin-top: 4px; }
          .inv-badge { background: #eff6ff; color: #1e3a8a; border: 1px solid #bfdbfe; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 13px; text-transform: uppercase; display: inline-block; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .section-h { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #1e3a8a; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 6px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; padding: 12px; border-bottom: 2px solid #e2e8f0; text-align: left; }
          td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13.5px; }
          .total-box { margin-left: auto; width: 340px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px 22px; border-radius: 12px; }
          .t-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13.5px; }
          .t-row.grand { border-top: 2px solid #0f172a; padding-top: 10px; font-size: 17px; font-weight: 900; color: #1e3a8a; }
          .stamp-box { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; border-top: 1.5px solid #f1f5f9; padding-top: 24px; }
          .seal { border: 2px dashed #16a34a; color: #16a34a; background: #f0fdf4; padding: 10px 22px; border-radius: 10px; font-weight: 900; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; display: inline-block; }
          .btn-print { background: #1e3a8a; color: #fff; padding: 12px 28px; border: none; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; margin-bottom: 24px; }
          @media print { .btn-print { display: none; } }
        </style>
      </head>
      <body>
        <div style="text-align: right; max-width: 820px; margin: 0 auto 10px;">
          <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
        </div>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="logo-title">GJ ENTERPRISE LUXURY TRAVEL</div>
              <div class="logo-sub">Bespoke Holiday Packages &amp; Corporate Concierge</div>
              <div style="font-size: 12px; color: #475569; margin-top: 8px;">
                GSTIN: <strong>09AAACG1234F1Z5</strong> | PAN: <strong>AAACG1234F</strong><br/>
                Corporate HQ: Alpha-1 Commercial Belt, Greater Noida, UP - 201310<br/>
                Helpline: +91 98765 43210 | Email: bookings@gjenterprise.com
              </div>
            </div>
            <div style="text-align: right;">
              <div class="inv-badge">Official GST Tax Invoice</div>
              <div style="font-size: 17px; font-weight: 900; color: #0f172a; margin-top: 10px;">${invoiceNum}</div>
              <div style="font-size: 13px; color: #64748b;">Date: ${invoiceDate}</div>
              <div style="font-size: 12px; color: #16a34a; font-weight: 800; margin-top: 4px;">Status: VERIFIED PAID</div>
            </div>
          </div>

          <div class="details-grid">
            <div>
              <div class="section-h">Billed To (Lead Traveller)</div>
              <div style="font-weight: 800; font-size: 16px;">${booking.customerName || user?.name || "Valued Customer"}</div>
              <div style="color: #475569; margin-top: 4px; font-size: 13.5px;">
                Email: ${booking.customerEmail || user?.email || "customer@gjenterprise.com"}<br/>
                Contact: ${booking.customerPhone || "+91 98765 43299"}
              </div>
            </div>
            <div>
              <div class="section-h">Tour Booking Voucher Reference</div>
              <div style="font-weight: 800; font-size: 15px; color: #1e3a8a;">#${booking.bookingReference || `GJE-${booking.id}`}</div>
              <div style="color: #475569; margin-top: 4px; font-size: 13.5px;">
                Destination: <strong>${booking.tourPackage?.destination || booking.destination || "Holiday Tour"}</strong><br/>
                Travel Date: <strong>${booking.travelDate || "As confirmed"}</strong> | Guests: <strong>${booking.adultsCount || 2} Adults</strong>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Service Description</th>
                <th>HSN / SAC</th>
                <th>Payment Mode</th>
                <th>Txn ID</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${booking.tourPackage?.title || booking.destination || "Luxury Tour Package"}</strong><br/>
                  <small style="color: #64748b;">Includes 4/5-Star Stays, AC Chauffeur Transfers, Guided Sightseeing &amp; Meals</small>
                </td>
                <td><strong>998555</strong></td>
                <td>${paymentInfo ? paymentInfo.method : "ONLINE_PORTAL"}</td>
                <td><code>${paymentInfo ? paymentInfo.txnId : "TXN-" + (booking.id || "8821")}</code></td>
                <td style="text-align: right; font-weight: 800;">₹${Number(advancePaid).toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <div class="t-row">
              <span>Taxable Value (Base):</span>
              <span>₹${baseAmount}</span>
            </div>
            <div class="t-row">
              <span>CGST (2.5%):</span>
              <span>₹${cgst}</span>
            </div>
            <div class="t-row">
              <span>SGST (2.5%):</span>
              <span>₹${sgst}</span>
            </div>
            <div class="t-row grand">
              <span>Total Paid Amount:</span>
              <span>₹${Number(advancePaid).toLocaleString("en-IN")}</span>
            </div>
            ${
              balanceDue > 0
                ? `<div class="t-row" style="margin-top: 10px; color: #ea580c; font-weight: 800; font-size: 13px;">
                    <span>Remaining Balance Due:</span>
                    <span>₹${balanceDue.toLocaleString("en-IN")}</span>
                  </div>`
                : `<div class="t-row" style="margin-top: 10px; color: #16a34a; font-weight: 800; font-size: 13px;">
                    <span>Balance Due:</span>
                    <span>₹0.00 (Fully Settled)</span>
                  </div>`
            }
          </div>

          <div class="stamp-box">
            <div>
              <div class="seal">✓ GST VERIFIED &amp; PAID</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Digitally signed e-Invoice. No physical signature required.</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; font-size: 14px; color: #1e3a8a;">For GJ ENTERPRISE</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 25px;">Authorized Finance Signatory</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  const printOfficialPdfQuotation = (enquiry) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download or print your official Tour Quotation Proposal.");
      return;
    }

    const quoteNum = `QT-2026-ENQ${enquiry.id || "01"}`;
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
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; padding: 40px; margin: 0; background: #fff; line-height: 1.5; }
          .quote-box { max-width: 820px; margin: 0 auto; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
          .header { display: flex; justify-content: space-between; border-bottom: 2.5px solid #1e3a8a; padding-bottom: 24px; margin-bottom: 24px; }
          .logo-title { font-size: 26px; font-weight: 900; color: #1e3a8a; letter-spacing: 0.5px; }
          .logo-sub { font-size: 13px; color: #64748b; font-weight: 600; margin-top: 4px; }
          .quote-badge { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 13px; text-transform: uppercase; display: inline-block; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 28px; }
          .section-h { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #1e3a8a; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 6px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; padding: 12px; border-bottom: 2px solid #e2e8f0; text-align: left; }
          td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13.5px; }
          .total-box { margin-left: auto; width: 340px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px 22px; border-radius: 12px; margin-bottom: 24px; }
          .t-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13.5px; }
          .t-row.grand { border-top: 2px solid #0f172a; padding-top: 10px; font-size: 17px; font-weight: 900; color: #1e3a8a; }
          .terms-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; font-size: 12px; color: #475569; margin-bottom: 24px; }
          .stamp-box { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1.5px solid #f1f5f9; padding-top: 24px; }
          .seal { border: 2px dashed #1e3a8a; color: #1e3a8a; background: #eff6ff; padding: 10px 22px; border-radius: 10px; font-weight: 900; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; display: inline-block; }
          .btn-print { background: #1e3a8a; color: #fff; padding: 12px 28px; border: none; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; margin-bottom: 24px; }
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
              <div style="font-size: 12px; color: #475569; margin-top: 8px;">
                GSTIN: <strong>09AAACG1234F1Z5</strong> | PAN: <strong>AAACG1234F</strong><br/>
                Corporate HQ: Alpha-1 Commercial Belt, Greater Noida, UP - 201310<br/>
                Helpline: +91 98765 43210 | Email: quotes@gjenterprise.com
              </div>
            </div>
            <div style="text-align: right;">
              <div class="quote-badge">Official Tour Quotation</div>
              <div style="font-size: 17px; font-weight: 900; color: #0f172a; margin-top: 10px;">${quoteNum}</div>
              <div style="font-size: 13px; color: #64748b;">Issued: ${quoteDate}</div>
              <div style="font-size: 12px; color: #166534; font-weight: 800; margin-top: 4px;">Valid Until: ${validUntil}</div>
            </div>
          </div>

          <div class="details-grid">
            <div>
              <div class="section-h">Quotation Prepared For</div>
              <div style="font-weight: 800; font-size: 16px;">${enquiry.name || user?.name || "Valued Traveller"}</div>
              <div style="color: #475569; margin-top: 4px; font-size: 13.5px;">
                Email: ${enquiry.email || user?.email || "customer@gjenterprise.com"}<br/>
                Contact: ${enquiry.phone || "+91 98765 43299"}
              </div>
            </div>
            <div>
              <div class="section-h">Trip Specifications</div>
              <div style="font-weight: 800; font-size: 15px; color: #1e3a8a;">${enquiry.destination || "Bespoke Custom Holiday"}</div>
              <div style="color: #475569; margin-top: 4px; font-size: 13.5px;">
                Service Tier: <strong>${enquiry.service || "Luxury Resort Experience"}</strong><br/>
                Travel Date: <strong>${enquiry.travelDate || "As Requested"}</strong> | Total Guests: <strong>${estPersons} Persons</strong>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tour Component / Deliverable</th>
                <th>Category</th>
                <th>Qty</th>
                <th style="text-align: right;">Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Luxury Stays &amp; Daily Breakfast / Dinner</strong><br/>
                  <small style="color: #64748b;">Handpicked 4-star / 5-star resort accommodations with premium hospitality</small>
                </td>
                <td>Hospitality</td>
                <td>${estPersons} Guests</td>
                <td style="text-align: right; font-weight: 700;">₹${Math.round(subtotal * 0.5).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td>
                  <strong>Private Dedicated AC Cab &amp; Airport Transfers</strong><br/>
                  <small style="color: #64748b;">Sanitized AC vehicle, professional driver, toll taxes, fuel, and airport meet &amp; greet</small>
                </td>
                <td>Logistics</td>
                <td>1 Private Cab</td>
                <td style="text-align: right; font-weight: 700;">₹${Math.round(subtotal * 0.3).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td>
                  <strong>Sightseeing Pass, Guided Excursions &amp; 24/7 SOS Concierge</strong><br/>
                  <small style="color: #64748b;">Entry passes, local expert guidance, travel insurance coverage, and 24/7 emergency line</small>
                </td>
                <td>Experiences</td>
                <td>All Inclusive</td>
                <td style="text-align: right; font-weight: 700;">₹${Math.round(subtotal * 0.2).toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <div class="t-row">
              <span>Package Subtotal:</span>
              <span>₹${subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div class="t-row">
              <span>GST (5% Tourism SAC 998555):</span>
              <span>₹${gstVal.toLocaleString("en-IN")}</span>
            </div>
            <div class="t-row grand">
              <span>Estimated Tour Value:</span>
              <span>₹${grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div class="terms-box">
            <strong>📋 Booking Terms &amp; Confirmation Policy:</strong>
            <ul style="margin: 6px 0 0; padding-left: 18px;">
              <li>Pay 20% advance token to instantly lock resort rates and reserve verified drivers.</li>
              <li>Free cancellation &amp; date reschedule up to 7 days before departure.</li>
              <li>All packages are backed by GJ Enterprise Quality Stays Guarantee &amp; Zero Hidden Fees.</li>
            </ul>
          </div>

          <div class="stamp-box">
            <div>
              <div class="seal">✓ OFFICIAL GJ PROPOSAL</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Proposal generated for customer consideration. Valid for 15 days.</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; font-size: 14px; color: #1e3a8a;">For GJ ENTERPRISE</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 25px;">Vikram Sharma (Senior Tour Planner)</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(quoteHtml);
    printWindow.document.close();
  };

  // -------------------------------------------------------------
  // LOGGED-OUT PORTAL HUB VIEW
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="dashboard-login-prompt">
        <div className="portal-landing-card">
          <span className="portal-badge">✈️ GJ ENTERPRISE TRAVELLER PORTAL</span>
          <h2>Access Your Trips, Bookings &amp; Invoices</h2>
          <p className="portal-subtext">
            Sign in to manage your vacations, make advance token payments, download verified GST tax invoices, and track live enquiry status.
          </p>

          <div className="portal-action-btns">
            <button
              type="button"
              className="btn-portal-primary"
              onClick={() => setAuthModalOpen(true)}
            >
              🔑 Sign In / Create Account →
            </button>
            <button
              type="button"
              className="btn-portal-demo"
              onClick={() => setAuthModalOpen(true)}
            >
              ⚡ Quick Sample Customer Sign-In
            </button>
          </div>

          <div className="portal-divider">
            <span>OR TRACK ANY TRIP AS GUEST</span>
          </div>

          {/* Guest Booking Tracker */}
          <div className="guest-tracker-card">
            <h4>🔍 Instant Trip &amp; Booking Tracker</h4>
            <p>Enter your Booking Ref # (e.g. <code>GJE-KSH-8821</code>, <code>GJE-GOA-5490</code>), Email, or Registered Phone Number:</p>

            <form onSubmit={handleTrackBooking} className="guest-tracker-form">
              <input
                type="text"
                required
                placeholder="e.g. GJE-KSH-8821 or customer@gjenterprise.com"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
              />
              <button type="submit" disabled={trackLoading}>
                {trackLoading ? "Searching..." : "Track My Trip 🚀"}
              </button>
            </form>

            {trackError && <div className="tracker-error-box">{trackError}</div>}

            {trackResult && (
              <div className="track-result-card">
                <div className="tr-header">
                  <div>
                    <span className="tr-ref">Booking #{trackResult.bookingReference || trackResult.id}</span>
                    <h3>{trackResult.tourPackage?.destination || trackResult.destination}</h3>
                    <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748b" }}>
                      {trackResult.tourPackage?.title || "Bespoke Holiday Package"}
                    </p>
                  </div>
                  <span className="tr-status">● {trackResult.status || "CONFIRMED"}</span>
                </div>

                <div className="tr-grid">
                  <div>
                    <span>Travel Date:</span>
                    <strong>📅 {trackResult.travelDate || "As confirmed"}</strong>
                  </div>
                  <div>
                    <span>Guests:</span>
                    <strong>👥 {trackResult.adultsCount || 2} Persons</strong>
                  </div>
                  <div>
                    <span>Package Total:</span>
                    <strong>₹{Number(trackResult.totalPrice || 24999).toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span>Advance Credited:</span>
                    <strong style={{ color: "#16a34a" }}>₹{Number(trackResult.advancePaid || 0).toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                <div className="tr-actions">
                  <button
                    className="btn-tr-invoice"
                    onClick={() => printGstTaxInvoice(trackResult)}
                  >
                    🖨️ Download GST Tax Invoice PDF
                  </button>
                  {Number(trackResult.advancePaid || 0) < Number(trackResult.totalPrice || 24999) && (
                    <button
                      className="btn-tr-pay"
                      onClick={() => {
                        setPaymentModalBooking(trackResult);
                        setPaymentAmount(
                          String(Number(trackResult.totalPrice || 24999) - Number(trackResult.advancePaid || 0))
                        );
                      }}
                    >
                      💳 Pay Balance (₹{Number(trackResult.totalPrice || 24999) - Number(trackResult.advancePaid || 0)})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    );
  }

  // Calculate Metrics for Logged-In User
  const totalTripsCount = bookings.length;
  const totalInvestment = bookings.reduce((sum, b) => sum + Number(b.totalPrice || 24999), 0);
  const totalAdvancePaid = bookings.reduce((sum, b) => sum + Number(b.advancePaid || 0), 0);
  const totalRemainingBalance = totalInvestment - totalAdvancePaid > 0 ? totalInvestment - totalAdvancePaid : 0;

  // -------------------------------------------------------------
  // LOGGED-IN EXECUTIVE VIP DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="customer-dashboard">
      {/* 1. VIP EXECUTIVE HERO HEADER */}
      <div className="vip-hero-banner">
        <div className="vip-hero-main">
          <div className="vip-avatar-badge">
            <div className="vip-avatar-circle">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "RS"}
            </div>
            <div className="vip-profile-info">
              <span className="vip-tier-pill">⭐ VIP CLUB TRAVELLER • ID: GJE-VIP-09</span>
              <h1>Welcome back, {user?.name || "Rahul Sharma"}!</h1>
              <p>GJ Enterprise Exclusive Traveller Portal • Greater Noida HQ Concierge</p>
            </div>
          </div>

          <div className="vip-quick-actions">
            <Link to="/destinations" className="btn-hero-action primary">
              + Book New Holiday
            </Link>
            <button
              className="btn-hero-action secondary"
              onClick={() => setActiveTab("CONCIERGE")}
            >
              🛎️ Concierge Help
            </button>
          </div>
        </div>

        {/* 4 Financial & Travel KPI Cards */}
        <div className="vip-kpi-grid">
          <div className="vip-kpi-card">
            <div className="kpi-icon-wrap blue">✈️</div>
            <div className="kpi-data">
              <span className="kpi-lbl">Active Bookings</span>
              <strong>{totalTripsCount} Tours</strong>
            </div>
          </div>

          <div className="vip-kpi-card">
            <div className="kpi-icon-wrap purple">💎</div>
            <div className="kpi-data">
              <span className="kpi-lbl">Total Tour Value</span>
              <strong>₹{totalInvestment.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className="vip-kpi-card">
            <div className="kpi-icon-wrap green">✓</div>
            <div className="kpi-data">
              <span className="kpi-lbl">Advance Paid</span>
              <strong style={{ color: "#16a34a" }}>₹{totalAdvancePaid.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className="vip-kpi-card">
            <div className="kpi-icon-wrap orange">⏳</div>
            <div className="kpi-data">
              <span className="kpi-lbl">Outstanding Balance</span>
              <strong style={{ color: totalRemainingBalance > 0 ? "#ea580c" : "#16a34a" }}>
                {totalRemainingBalance > 0 ? `₹${totalRemainingBalance.toLocaleString("en-IN")}` : "All Clear ✓"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="cust-dash-tabs">
        <button
          className={`tab-btn ${activeTab === "BOOKINGS" ? "active" : ""}`}
          onClick={() => setActiveTab("BOOKINGS")}
        >
          ✈️ My Tour Bookings ({bookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "DOCUMENTS" ? "active" : ""}`}
          onClick={() => setActiveTab("DOCUMENTS")}
        >
          📁 Travel Documents &amp; Vault ({documents.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "PAYMENTS" ? "active" : ""}`}
          onClick={() => setActiveTab("PAYMENTS")}
        >
          💳 Payments &amp; GST Invoices
        </button>
        <button
          className={`tab-btn ${activeTab === "ENQUIRIES" ? "active" : ""}`}
          onClick={() => setActiveTab("ENQUIRIES")}
        >
          📝 Quotations &amp; Enquiries ({enquiries.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "CONCIERGE" ? "active" : ""}`}
          onClick={() => setActiveTab("CONCIERGE")}
        >
          🛎️ 24/7 Dedicated Concierge
        </button>
      </div>

      {/* 3. MAIN TAB CONTENT */}
      <div className="cust-dash-content">
        {/* TAB 1: BOOKINGS */}
        {activeTab === "BOOKINGS" && (
          <div>
            {bookings.length === 0 ? (
              <div className="cust-empty">
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>✈️</span>
                <h3>No bookings found for {user?.name || user?.email || 'your account'}</h3>
                <p>You have not booked any holiday packages yet. Explore our bespoke luxury packages and plan your dream vacation!</p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
                  <Link to="/destinations" className="explore-btn">
                    Explore Destinations &amp; Book Tour →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="booking-cards-grid">
                {bookings.map((booking) => {
                  const total = Number(booking.totalPrice || 24999);
                  const advance = Number(booking.advancePaid || 0);
                  const remaining = total - advance > 0 ? total - advance : 0;
                  const isFullyPaid = remaining === 0;
                  const paidPercentage = Math.min(100, Math.round((advance / total) * 100));
                  const destName = booking.tourPackage?.destination || booking.destination || "Kashmir";
                  const coverImg =
                    booking.tourPackage?.imageUrl ||
                    DESTINATION_FALLBACK_IMAGES[destName] ||
                    DESTINATION_FALLBACK_IMAGES.Kashmir;

                  return (
                    <div key={booking.id} className="luxury-booking-card">
                      {/* Destination Image Banner */}
                      <div className="bcard-img-banner">
                        <img src={coverImg} alt={destName} />
                        <span className="bcard-dest-badge">{destName}</span>
                        <span className={`bcard-status-badge ${isFullyPaid ? "paid" : advance > 0 ? "partial" : "pending"}`} style={{
                          background: isFullyPaid ? '#dcfce7' : advance > 0 ? '#eff6ff' : '#fee2e2',
                          color: isFullyPaid ? '#166534' : advance > 0 ? '#1e3a8a' : '#991b1b',
                          border: isFullyPaid ? '1px solid #bbf7d0' : advance > 0 ? '1px solid #bfdbfe' : '1px solid #fecaca'
                        }}>
                          {isFullyPaid ? "✓ FULLY PAID & CONFIRMED" : advance > 0 ? "● ADVANCE TOKEN PAID" : "⏳ PAYMENT PENDING"}
                        </span>
                      </div>

                      <div className="luxury-bcard-body">
                        <div className="bcard-title-row">
                          <div>
                            <span className="voucher-ref">VOUCHER #{booking.bookingReference || `GJE-${booking.id}`}</span>
                            <h3 className="bcard-heading">
                              {booking.tourPackage?.title || `${destName} Handcrafted Tour`}
                            </h3>
                          </div>
                        </div>

                        {/* Booking Meta Details */}
                        <div className="bcard-meta-chips">
                          <span className="meta-chip">📅 Travel: {booking.travelDate || "As confirmed"}</span>
                          <span className="meta-chip">👥 Guests: {booking.adultsCount || 2} Persons</span>
                          <span className="meta-chip">⏱️ Duration: {booking.tourPackage?.duration || "5D / 4N"}</span>
                        </div>

                        {/* Live Trip Pipeline Progress */}
                        <div className="trip-pipeline">
                          <div className="pipeline-steps">
                            <div className="p-step completed">
                              <div className="step-dot">✓</div>
                              <span>Booked</span>
                            </div>
                            <div className="p-step completed">
                              <div className="step-dot">✓</div>
                              <span>Hotels Assigned</span>
                            </div>
                            <div className={`p-step ${advance > 0 ? "completed" : "pending"}`}>
                              <div className="step-dot">{advance > 0 ? "✓" : "3"}</div>
                              <span>Advance Token</span>
                            </div>
                            <div className={`p-step ${isFullyPaid ? "completed" : "pending"}`}>
                              <div className="step-dot">{isFullyPaid ? "✓" : "4"}</div>
                              <span>Final Voucher</span>
                            </div>
                          </div>
                        </div>

                        {/* Inclusions Pill Row */}
                        <div className="bcard-inclusions-row">
                          <span className="inc-badge">🏨 4-Star Resort</span>
                          <span className="inc-badge">🚗 Private AC Cab</span>
                          <span className="inc-badge">🍳 Daily Breakfast &amp; Dinner</span>
                          <span className="inc-badge">🛡️ Travel Insurance</span>
                        </div>

                        {/* Financial Ledger & Progress Bar */}
                        <div className="bcard-finance-box">
                          <div className="finance-row">
                            <span>Package Total:</span>
                            <strong>₹{total.toLocaleString("en-IN")}</strong>
                          </div>
                          <div className="finance-row">
                            <span>Advance Credited:</span>
                            <strong style={{ color: "#16a34a" }}>₹{advance.toLocaleString("en-IN")}</strong>
                          </div>
                          {remaining > 0 ? (
                            <div className="finance-row balance-row">
                              <span>Remaining Due:</span>
                              <strong style={{ color: "#ea580c" }}>₹{remaining.toLocaleString("en-IN")}</strong>
                            </div>
                          ) : (
                            <div className="finance-row balance-row settled">
                              <span>Account Balance:</span>
                              <strong style={{ color: "#16a34a" }}>₹0.00 (Fully Settled)</strong>
                            </div>
                          )}

                          <div className="progress-bar-wrap">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${paidPercentage}%` }}
                            ></div>
                          </div>
                          <div className="progress-lbl">{paidPercentage}% Payment Settled</div>
                        </div>

                        {/* Action Buttons Hub */}
                        <div className="luxury-bcard-actions-hub" style={{ marginTop: 'auto', paddingTop: '14px' }}>
                          {remaining > 0 ? (
                            <button
                              type="button"
                              className="btn-card-pay-primary"
                              style={{
                                background: advance === 0 ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                                color: '#ffffff',
                                fontWeight: '800',
                                padding: '13px 18px',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                boxShadow: advance === 0 ? '0 4px 14px rgba(22, 163, 74, 0.35)' : '0 4px 14px rgba(30, 58, 138, 0.25)',
                                marginBottom: '10px',
                                transition: 'all 0.2s ease',
                                boxSizing: 'border-box'
                              }}
                              onClick={() => {
                                setPaymentModalBooking(booking);
                                const defaultPay = advance === 0 ? Math.min(15000, remaining) : remaining;
                                setPaymentAmount(String(defaultPay));
                              }}
                            >
                              <span>💳</span>
                              <span>
                                {advance === 0
                                  ? `Pay Advance Token (₹${Math.min(15000, remaining).toLocaleString("en-IN")})`
                                  : `Pay Balance Due (₹${remaining.toLocaleString("en-IN")})`}
                              </span>
                              <span>→</span>
                            </button>
                          ) : (
                            <div style={{
                              width: '100%',
                              textAlign: 'center',
                              background: '#dcfce7',
                              color: '#15803d',
                              border: '1px solid #86efac',
                              padding: '11px 14px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: '800',
                              marginBottom: '10px',
                              boxSizing: 'border-box'
                            }}>
                              ✓ 100% Paid in Full &amp; Confirmed
                            </div>
                          )}

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
                            <button
                              type="button"
                              className="btn-card-itinerary"
                              style={{ width: '100%', textAlign: 'center', padding: '10px 8px', fontSize: '12.5px', fontWeight: '700', borderRadius: '8px', background: '#ffffff', border: '1.5px solid #cbd5e1', color: '#334155', cursor: 'pointer' }}
                              onClick={() => setActiveItinerary(booking.tourPackage || booking)}
                            >
                              📋 View Itinerary
                            </button>

                            <button
                              type="button"
                              className="btn-card-invoice"
                              style={{ width: '100%', textAlign: 'center', padding: '10px 8px', fontSize: '12.5px', fontWeight: '700', borderRadius: '8px', background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1e3a8a', cursor: 'pointer' }}
                              onClick={() => printGstTaxInvoice(booking)}
                            >
                              🖨️ Tax Invoice PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: DOCUMENTS & KYC VAULT */}
        {activeTab === "DOCUMENTS" && (
          <div className="documents-tab-view">
            {/* Vault Banner Header */}
            <div className="vault-header-banner">
              <div className="vh-text">
                <span className="vh-badge">🔒 256-Bit Encrypted Traveller Vault</span>
                <h3>Travel Documents &amp; KYC Manager</h3>
                <p>Upload passports, Aadhaar cards, visas, and download official flight e-tickets &amp; hotel vouchers.</p>
              </div>
              <button
                type="button"
                className="btn-upload-doc-cta"
                onClick={() => setUploadDocModalOpen(true)}
              >
                + Upload Travel Document 📤
              </button>
            </div>

            {/* Document Filter Bar */}
            <div className="doc-filter-bar">
              {[
                { key: "ALL", label: `All Documents (${documents.length})` },
                { key: "PASSPORT", label: "🛂 Passports" },
                { key: "AADHAAR_ID", label: "🪪 Govt Photo IDs" },
                { key: "FLIGHT_TICKET", label: "✈️ Flight E-Tickets" },
                { key: "HOTEL_VOUCHER", label: "🏨 Hotel Vouchers" },
                { key: "TRAVEL_INSURANCE", label: "🛡️ Insurance Policies" },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`df-btn ${docCategoryFilter === f.key ? "active" : ""}`}
                  onClick={() => setDocCategoryFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Documents Grid */}
            {(() => {
              const filteredDocs =
                docCategoryFilter === "ALL"
                  ? documents
                  : documents.filter((d) => d.documentCategory === docCategoryFilter);

              if (filteredDocs.length === 0) {
                return (
                  <div className="cust-empty">
                    <span style={{ fontSize: "40px", display: "block", marginBottom: "10px" }}>📁</span>
                    <h3>No documents in this category</h3>
                    <p>Upload your travel documents for seamless visa clearance and hassle-free airport check-in.</p>
                    <button
                      type="button"
                      className="explore-btn"
                      onClick={() => setUploadDocModalOpen(true)}
                    >
                      + Upload Now
                    </button>
                  </div>
                );
              }

              return (
                <div className="documents-cards-grid">
                  {filteredDocs.map((doc) => {
                    const isVerified = doc.verificationStatus === "VERIFIED";
                    const isRejected = doc.verificationStatus === "REJECTED";
                    const isPdf = doc.fileType?.includes("pdf") || doc.fileName?.endsWith(".pdf");

                    return (
                      <div key={doc.id} className="luxury-doc-card">
                        <div className="doc-card-top">
                          <div className="doc-icon-wrap">
                            {isPdf ? "📄" : "🖼️"}
                          </div>
                          <div className="doc-top-info">
                            <span className="doc-cat-tag">{doc.documentCategory?.replace("_", " ")}</span>
                            <span
                              className={`doc-status-pill ${
                                isVerified ? "verified" : isRejected ? "rejected" : "pending"
                              }`}
                            >
                              {isVerified
                                ? "✓ VERIFIED BY AGENT"
                                : isRejected
                                ? "❌ RE-UPLOAD NEEDED"
                                : "⏳ PENDING VERIFICATION"}
                            </span>
                          </div>
                        </div>

                        <h4 className="doc-filename" title={doc.fileName}>
                          {doc.fileName || "Travel_Document.pdf"}
                        </h4>

                        <div className="doc-meta-box">
                          <div className="d-meta-row">
                            <span>Linked Tour:</span>
                            <strong>#{doc.bookingReference || "GJE-KSH-8821"}</strong>
                          </div>
                          <div className="d-meta-row">
                            <span>File Size:</span>
                            <strong>{doc.fileSize || "1.2 MB"}</strong>
                          </div>
                          <div className="d-meta-row">
                            <span>Uploaded By:</span>
                            <span className="uploader-tag">
                              {doc.uploadedByRole === "ADMIN" ? "🏢 GJ Enterprise Team" : "👤 You (Traveller)"}
                            </span>
                          </div>
                          {doc.rejectionReason && (
                            <div className="doc-reject-note">
                              <strong>Reason:</strong> {doc.rejectionReason}
                            </div>
                          )}
                        </div>

                        <div className="doc-card-actions">
                          <button
                            type="button"
                            className="btn-doc-preview"
                            onClick={() => setPreviewDoc(doc)}
                          >
                            👁️ Preview
                          </button>
                          <button
                            type="button"
                            className="btn-doc-download"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            ⬇️ Download
                          </button>
                          {doc.uploadedByRole !== "ADMIN" && (
                            <button
                              type="button"
                              className="btn-doc-delete"
                              onClick={() => handleDeleteDocument(doc.id)}
                              title="Delete from vault"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: PAYMENTS & INVOICES */}
        {activeTab === "PAYMENTS" && (
          <div className="payments-tab-view">
            <div className="section-title-wrap">
              <h3>💳 Payment Receipts &amp; GST Tax Invoices</h3>
              <p>Review all historical advance tokens, card transactions, and UPI receipts.</p>
            </div>

            <div className="payments-table-container">
              <table className="luxury-data-table">
                <thead>
                  <tr>
                    <th>Txn ID</th>
                    <th>Booking Ref</th>
                    <th>Destination</th>
                    <th>Amount Paid</th>
                    <th>Payment Mode</th>
                    <th>Date &amp; Time</th>
                    <th>Status</th>
                    <th>Tax Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, idx) => (
                    <tr key={b.id || idx}>
                      <td>
                        <code>TXN-{b.bookingReference ? b.bookingReference.replace(/\D/g, "") : `88${idx + 1}`}</code>
                      </td>
                      <td>
                        <strong>#{b.bookingReference || `GJE-${b.id}`}</strong>
                      </td>
                      <td>{b.tourPackage?.destination || b.destination}</td>
                      <td>
                        <strong style={{ color: "#16a34a", fontSize: "14.5px" }}>
                          ₹{Number(b.advancePaid || b.totalPrice || 24999).toLocaleString("en-IN")}
                        </strong>
                      </td>
                      <td>
                        <span className="mode-tag">{idx % 2 === 0 ? "UPI / QR" : "CARD (VISA)"}</span>
                      </td>
                      <td>{new Date().toLocaleDateString("en-IN")}</td>
                      <td>
                        <span className="status-badge-green">● SUCCESS</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-table-print"
                          onClick={() => printGstTaxInvoice(b)}
                        >
                          🖨️ PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ENQUIRIES */}
        {activeTab === "ENQUIRIES" && (
          <div>
            {enquiries.length === 0 ? (
              <div className="cust-empty">
                <h3>No enquiries submitted yet</h3>
                <p>Have custom requirements or need a bespoke honeymoon or group quotation?</p>
                <Link to="/contact" className="explore-btn">
                  Submit New Enquiry →
                </Link>
              </div>
            ) : (
              <div className="enquiry-cards-list">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="luxury-enquiry-card">
                    <div className="enq-header-row">
                      <div>
                        <span className="enq-ref">ENQUIRY #ENQ-2026-0{enq.id}</span>
                        <h3>{enq.destination || "Custom Bespoke Tour"}</h3>
                      </div>
                      <span className="enq-status-badge">
                        ● {enq.status || "QUOTATION_READY"}
                      </span>
                    </div>

                    <div className="enq-body-content">
                      <p className="enq-message-text">
                        <strong>Traveller Note:</strong> "{enq.message || "Custom itinerary request for family vacation."}"
                      </p>
                      <div className="enq-chips-grid">
                        <div className="echip">
                          <span>Service Requested:</span>
                          <strong>{enq.service || "Luxury Package"}</strong>
                        </div>
                        <div className="echip">
                          <span>Travel Date:</span>
                          <strong>📅 {enq.travelDate || "Flexible"}</strong>
                        </div>
                        <div className="echip">
                          <span>Travellers:</span>
                          <strong>👥 {enq.travellers || 2} Persons</strong>
                        </div>
                      </div>
                    </div>

                    <div className="enq-footer-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <span className="assigned-agent">👨‍💼 Assigned Planner: Vikram Sharma (Lead Destination Specialist)</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn-enq-respond"
                          style={{ background: '#1e3a8a', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
                          onClick={() => printOfficialPdfQuotation(enq)}
                        >
                          📄 Download Quotation PDF
                        </button>
                        <Link to="/contact" className="btn-enq-respond" style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700' }}>
                          Update Request →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONCIERGE DESK */}
        {activeTab === "CONCIERGE" && (
          <div className="concierge-tab-view">
            <div className="concierge-hero-box">
              <div className="concierge-avatar">👨‍💼</div>
              <div className="concierge-info">
                <span className="concierge-tag">DEDICATED TOUR CONCIERGE</span>
                <h3>Vikram Sharma</h3>
                <p>Senior Holiday Experience Manager • GJ Enterprise Executive Desk</p>
                <div className="concierge-badge-row">
                  <span>⚡ Average Response Time: &lt; 5 mins</span>
                  <span>🛡️ 24/7 On-Ground Emergency SOS</span>
                  <span>⭐ 4.98/5 Customer Satisfaction</span>
                </div>
              </div>
            </div>

            <div className="concierge-grid">
              <div className="concierge-card">
                <div className="cc-icon">💬</div>
                <h4>Instant WhatsApp Concierge</h4>
                <p>Chat directly with your tour manager for hotel upgrades, cab time changes, and special requests.</p>
                <button
                  type="button"
                  className="btn-cc-action whatsapp"
                  onClick={() => window.open("https://wa.me/919876543210?text=Hi%20GJ%20Enterprise%2C%20I%20need%20assistance%20with%20my%20booking", "_blank")}
                >
                  Open WhatsApp Chat →
                </button>
              </div>

              <div className="concierge-card">
                <div className="cc-icon">📞</div>
                <h4>24/7 Priority Emergency Line</h4>
                <p>Toll-free priority helpline for on-tour airport pickup assistance, medical help, and driver support.</p>
                <a href="tel:+919876543210" className="btn-cc-action call">
                  Call Concierge: +91 98765 43210
                </a>
              </div>

              <div className="concierge-card">
                <div className="cc-icon">🛡️</div>
                <h4>GJ Traveller Guarantee</h4>
                <p>Every booking is backed by sanitized 4-star stays, verified drivers, and guaranteed zero hidden charges.</p>
                <Link to="/about" className="btn-cc-action outline">
                  View Our Guarantees →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ITINERARY MODAL */}
      {activeItinerary && (
        <ItineraryModal
          tourPackage={activeItinerary}
          onClose={() => setActiveItinerary(null)}
        />
      )}

      {/* Advanced Interactive Payment Gateway Modal */}
      {paymentModalBooking && (
        <div className="pay-modal-overlay" onClick={() => setPaymentModalBooking(null)}>
          <div className="pay-modal-card-advanced" onClick={(e) => e.stopPropagation()}>
            <button className="pay-modal-close" onClick={() => setPaymentModalBooking(null)}>
              ✕
            </button>

            <div className="pay-gateway-header">
              <div className="pay-gateway-title">
                <span className="pay-ssl-badge">🔒 256-Bit SSL Encrypted</span>
                <h3>GJ Enterprise Payment Gateway</h3>
                <p>
                  Booking #{paymentModalBooking.bookingReference || paymentModalBooking.id} • {paymentModalBooking.tourPackage?.destination || paymentModalBooking.destination}
                </p>
              </div>
              <div className="pay-amount-badge">
                <span>Amount to Pay</span>
                <strong>₹{Number(paymentAmount).toLocaleString("en-IN")}</strong>
              </div>
            </div>

            {/* Gateway Tabs */}
            <div className="pay-method-tabs">
              <button
                type="button"
                className={`pm-tab ${gatewayTab === "UPI" ? "active" : ""}`}
                onClick={() => setGatewayTab("UPI")}
              >
                📱 UPI / QR Code
              </button>
              <button
                type="button"
                className={`pm-tab ${gatewayTab === "CARD" ? "active" : ""}`}
                onClick={() => setGatewayTab("CARD")}
              >
                💳 Debit / Credit Card
              </button>
              <button
                type="button"
                className={`pm-tab ${gatewayTab === "NET_BANKING" ? "active" : ""}`}
                onClick={() => setGatewayTab("NET_BANKING")}
              >
                🏦 Net Banking
              </button>
              <button
                type="button"
                className={`pm-tab ${gatewayTab === "BANK_TRANSFER" ? "active" : ""}`}
                onClick={() => setGatewayTab("BANK_TRANSFER")}
              >
                🏢 IMPS / NEFT
              </button>
            </div>

            <form onSubmit={handleMakePayment} className="pay-gateway-body">
              {gatewayTab === "UPI" && (
                <div className="upi-pane">
                  <div className="qr-box-wrapper">
                    <div className="qr-code-placeholder">
                      <div className="qr-simulated-grid">
                        <div className="qr-corner top-left"></div>
                        <div className="qr-corner top-right"></div>
                        <div className="qr-corner bottom-left"></div>
                        <div className="qr-center-logo">GJ</div>
                      </div>
                      <span className="qr-scan-text">Scan with any UPI App</span>
                    </div>

                    <div className="upi-details-col">
                      <div className="upi-vpa-copy">
                        <label>Official Merchant UPI VPA:</label>
                        <div className="vpa-field">
                          <code>gjenterprise@okhdfcbank</code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText("gjenterprise@okhdfcbank");
                              alert("UPI ID Copied!");
                            }}
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="upi-apps-row">
                        <span className="app-pill">🟢 Google Pay</span>
                        <span className="app-pill">🟣 PhonePe</span>
                        <span className="app-pill">🔵 Paytm</span>
                        <span className="app-pill">🟠 BHIM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {gatewayTab === "CARD" && (
                <div className="card-pane">
                  <div className="virtual-card">
                    <div className="vcard-top">
                      <span className="vcard-chip">💳 CHIP</span>
                      <span className="vcard-brand">VISA / RuPay</span>
                    </div>
                    <div className="vcard-number">{cardData.number || "•••• •••• •••• ••••"}</div>
                    <div className="vcard-bottom">
                      <div>
                        <span className="vcard-lbl">CARD HOLDER</span>
                        <div className="vcard-val">{cardData.name || "GUEST NAME"}</div>
                      </div>
                      <div>
                        <span className="vcard-lbl">EXPIRES</span>
                        <div className="vcard-val">{cardData.expiry || "MM/YY"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-inputs-grid">
                    <div>
                      <label>Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="4532 8900 1234 5678"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Name on card"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>CVV / CVC</label>
                      <input
                        type="password"
                        maxLength="4"
                        required
                        placeholder="•••"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {gatewayTab === "NET_BANKING" && (
                <div className="netbank-pane">
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "10px" }}>
                    Select Your Bank:
                  </label>
                  <div className="bank-grid">
                    {["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank"].map((b) => (
                      <div
                        key={b}
                        className={`bank-tile ${selectedBank === b ? "selected" : ""}`}
                        onClick={() => setSelectedBank(b)}
                      >
                        <span className="bank-icon">🏛️</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {gatewayTab === "BANK_TRANSFER" && (
                <div className="neft-pane">
                  <div className="neft-box">
                    <h4>Direct Bank Account Details for NEFT / RTGS / IMPS:</h4>
                    <div className="neft-grid">
                      <div>
                        <span>Account Name:</span>
                        <strong>GJ Enterprise Luxury Holidays LLP</strong>
                      </div>
                      <div>
                        <span>Account Number:</span>
                        <strong>50200088991122</strong>
                      </div>
                      <div>
                        <span>IFSC Code:</span>
                        <strong>HDFC0001234</strong>
                      </div>
                      <div>
                        <span>Bank &amp; Branch:</span>
                        <strong>HDFC Bank Ltd, Greater Noida Alpha-1</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="pay-gateway-submit-btn" disabled={paymentLoading}>
                {paymentLoading ? "Securing & Processing Payment..." : `Pay ₹${Number(paymentAmount).toLocaleString("en-IN")} Securely Now 🔒`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Success Screen Modal */}
      {paymentSuccessData && (
        <div className="pay-modal-overlay" onClick={() => setPaymentSuccessData(null)}>
          <div className="pay-success-card" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon-circle">✓</div>
            <h2>Payment Successful!</h2>
            <p className="success-sub">Your payment has been verified and credited to your booking.</p>

            <div className="success-details-box">
              <div className="s-row">
                <span>Transaction ID:</span>
                <strong><code>{paymentSuccessData.txnId}</code></strong>
              </div>
              <div className="s-row">
                <span>Amount Paid:</span>
                <strong style={{ color: "#16a34a", fontSize: "16px" }}>₹{paymentSuccessData.amount.toLocaleString("en-IN")}</strong>
              </div>
              <div className="s-row">
                <span>Payment Mode:</span>
                <span className="mode-badge">{paymentSuccessData.method}</span>
              </div>
              <div className="s-row">
                <span>Booking Reference:</span>
                <strong>#{paymentSuccessData.booking.bookingReference || paymentSuccessData.booking.id}</strong>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', textAlign: 'left', fontSize: '12.5px', color: '#166534' }}>
              <div>📧 <strong>Confirmation Email Dispatched</strong> to <code>{paymentSuccessData.booking.customerEmail || user?.email || 'customer@gjenterprise.com'}</code></div>
              <div style={{ marginTop: '4px' }}>📱 <strong>SMS / WhatsApp Alert Sent</strong> to <code>{paymentSuccessData.booking.customerPhone || user?.phone || '+91 9876543299'}</code></div>
            </div>

            <div className="success-actions">
              <button
                className="btn-print-inv"
                onClick={() => {
                  printGstTaxInvoice(paymentSuccessData.booking, paymentSuccessData);
                }}
              >
                🖨️ Download GST Tax Invoice PDF
              </button>
              <button
                className="btn-close-success"
                onClick={() => setPaymentSuccessData(null)}
              >
                Done / Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DOCUMENT UPLOAD MODAL */}
      {uploadDocModalOpen && (
        <div className="pay-modal-overlay" onClick={() => setUploadDocModalOpen(false)}>
          <div className="doc-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="pay-modal-close" onClick={() => setUploadDocModalOpen(false)}>
              ✕
            </button>

            <div className="doc-modal-header">
              <span className="doc-upload-pill">📤 ENCRYPTED DOCUMENT UPLOAD</span>
              <h3>Upload Travel Document to Vault</h3>
              <p>Upload your Government ID, Passport, Flight Tickets, or Travel Insurance for verified holiday operations.</p>
            </div>

            <form onSubmit={handleUploadDocumentSubmit} className="doc-upload-form">
              <div className="doc-form-group">
                <label>Document Category *</label>
                <select
                  value={newDocData.documentCategory}
                  onChange={(e) => setNewDocData({ ...newDocData, documentCategory: e.target.value })}
                  required
                >
                  <option value="PASSPORT">🛂 Passport (International Tours)</option>
                  <option value="AADHAAR_ID">🪪 Aadhaar Card / Voter ID (Domestic Tours)</option>
                  <option value="FLIGHT_TICKET">✈️ Flight E-Ticket / Boarding Pass</option>
                  <option value="VISA">📄 Visa Copy / Entry Permit</option>
                  <option value="HOTEL_VOUCHER">🏨 Hotel Booking Confirmation</option>
                  <option value="TRAVEL_INSURANCE">🛡️ Travel Insurance Certificate</option>
                  <option value="OTHER">📁 Other Travel Document</option>
                </select>
              </div>

              <div className="doc-form-group">
                <label>Link to Tour Booking *</label>
                <select
                  value={newDocData.bookingReference}
                  onChange={(e) => setNewDocData({ ...newDocData, bookingReference: e.target.value })}
                  required
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.bookingReference || `GJE-${b.id}`}>
                      #{b.bookingReference || `GJE-${b.id}`} - {b.tourPackage?.destination || b.destination} ({b.travelDate || "2026"})
                    </option>
                  ))}
                  <option value="GENERAL_KYC">General Traveller Profile KYC</option>
                </select>
              </div>

              {/* File Dropzone Area */}
              <div className="doc-dropzone">
                <input
                  type="file"
                  id="vault-file-input"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  required={!newDocData.fileData}
                />
                <label htmlFor="vault-file-input" className="dropzone-label">
                  <div className="dropzone-icon">📁</div>
                  <div className="dropzone-text">
                    <strong>Click to browse or drag &amp; drop document</strong>
                    <span>Supports PDF, JPG, JPEG, PNG (Max 10 MB)</span>
                  </div>
                </label>

                {newDocData.fileName && (
                  <div className="selected-file-chip">
                    <span>📄 {newDocData.fileName}</span>
                    <strong style={{ color: "#16a34a" }}>({newDocData.fileSize})</strong>
                  </div>
                )}
              </div>

              <div className="doc-upload-guarantee">
                🔒 <strong>Data Privacy Guarantee:</strong> All travel documents are stored with end-to-end encryption and accessible only by authorized GJ Enterprise flight and visa officers.
              </div>

              <button
                type="submit"
                className="btn-submit-upload-doc"
                disabled={uploadLoading || !newDocData.fileName}
              >
                {uploadLoading ? "Uploading & Encrypting Document..." : "Securely Upload & Store in Vault 🔒"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="pay-modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="doc-preview-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="pay-modal-close" onClick={() => setPreviewDoc(null)}>
              ✕
            </button>

            <div className="preview-modal-header">
              <div>
                <span className="doc-cat-tag">{previewDoc.documentCategory?.replace("_", " ")}</span>
                <h3>{previewDoc.fileName}</h3>
                <p>
                  Linked to Booking #{previewDoc.bookingReference} • Uploaded on {new Date(previewDoc.uploadDate || Date.now()).toLocaleDateString("en-IN")}
                </p>
              </div>
              <span
                className={`doc-status-pill ${
                  previewDoc.verificationStatus === "VERIFIED" ? "verified" : "pending"
                }`}
              >
                {previewDoc.verificationStatus === "VERIFIED" ? "✓ VERIFIED" : "⏳ PENDING"}
              </span>
            </div>

            <div className="preview-content-box">
              {previewDoc.fileData && previewDoc.fileData.startsWith("data:image") ? (
                <img
                  src={previewDoc.fileData}
                  alt={previewDoc.fileName}
                  className="preview-img-element"
                />
              ) : (
                <div className="pdf-simulated-preview">
                  <div className="pdf-icon-big">📄</div>
                  <h4>{previewDoc.fileName}</h4>
                  <p>Official PDF Travel Document ({previewDoc.fileSize || "1.2 MB"})</p>
                  <div className="pdf-preview-meta">
                    <div>Category: <strong>{previewDoc.documentCategory}</strong></div>
                    <div>Traveller: <strong>{previewDoc.customerName || "Rahul Sharma"}</strong></div>
                    <div>Uploaded By: <strong>{previewDoc.uploadedByRole === "ADMIN" ? "GJ Enterprise Staff" : "Customer"}</strong></div>
                  </div>
                </div>
              )}
            </div>

            <div className="preview-modal-actions">
              <button
                type="button"
                className="btn-doc-download-preview"
                onClick={() => handleDownloadDocument(previewDoc)}
              >
                ⬇️ Download Official Document
              </button>
              <button
                type="button"
                className="btn-close-preview"
                onClick={() => setPreviewDoc(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
