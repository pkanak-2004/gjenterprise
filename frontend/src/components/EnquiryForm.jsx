import { useState } from 'react'
import { submitEnquiry } from '../services/api'

function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelDate: '',
    travellers: 1,
    message: '',
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage('')

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        destination: formData.destination,
        service: formData.service || "Tour Package Enquiry",
        travelDate: formData.travelDate ? formData.travelDate : null,
        travellers: Number(formData.travellers) || 1,
        message: formData.message || "Enquiry from website",
      };

      const saved = await submitEnquiry(payload);

      setMessage(
        `Thank you, ${saved.name}! Your enquiry for ${saved.destination} has been received.`
      )

      setFormData({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelDate: '',
        travellers: 1,
        message: '',
      })
    } catch (error) {
      setMessage('Error submitting enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact">
      <h2>Travel Enquiry</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="travelDate"
          min={new Date().toISOString().split("T")[0]}
          value={formData.travelDate}
          onChange={handleChange}
        />

        <input
          type="number"
          name="travellers"
          min="1"
          value={formData.travellers}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Tell us about your trip..."
          value={formData.message}
          onChange={handleChange}
          rows="5"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Travel Enquiry'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </section>
  )
}

export default EnquiryForm