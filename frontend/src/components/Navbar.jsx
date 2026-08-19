import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-logo">
        GJ Enterprise
      </div>

      <div className="navbar-links">

        <Link to="/">Home</Link>

        <Link to="/about">About</Link>

        <Link to="/destinations">Destinations</Link>

        <Link to="/services">Services</Link>

        <Link to="/contact">Contact</Link>

      </div>

      <Link to="/contact" className="navbar-button">
        Enquire Now
      </Link>

    </nav>
  )
}

export default Navbar