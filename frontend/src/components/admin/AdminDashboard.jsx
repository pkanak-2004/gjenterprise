import { useEffect, useState } from 'react'

function AdminDashboard() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch('/api/enquiries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch enquiries')
      }

      const data = await response.json()
      setEnquiries(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Loading enquiries...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <section>
      <h2>Admin Dashboard</h2>

      <h3>Total Enquiries: {enquiries.length}</h3>

      {enquiries.length === 0 ? (
        <p>No enquiries found.</p>
      ) : (
        <div>
          {enquiries.map((enquiry) => (
            <div key={enquiry.id}>
              <h3>{enquiry.name}</h3>

              <p>Email: {enquiry.email}</p>
              <p>Phone: {enquiry.phone}</p>
              <p>Destination: {enquiry.destination}</p>
              <p>Travel Date: {enquiry.travelDate}</p>
              <p>Travellers: {enquiry.travellers}</p>
              <p>Message: {enquiry.message}</p>
              <p>Status: {enquiry.status}</p>

              <hr />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminDashboard