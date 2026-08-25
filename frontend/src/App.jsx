import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Destinations from './pages/Destinations'
import Services from './pages/Services'
import Contact from './pages/Contact'
import CustomerDashboard from './pages/CustomerDashboard'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
            </>
          }
        />

        {/* DESTINATIONS */}
        <Route
          path="/destinations"
          element={
            <>
              <Navbar />
              <Destinations />
            </>
          }
        />

        {/* SERVICES */}
        <Route
          path="/services"
          element={
            <>
              <Navbar />
              <Services />
            </>
          }
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <Contact />
            </>
          }
        />

        {/* CUSTOMER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <CustomerDashboard />
            </>
          }
        />
        <Route
          path="/customer-dashboard"
          element={
            <>
              <Navbar />
              <CustomerDashboard />
            </>
          }
        />

      </Routes>
    </BrowserRouter>
  </AuthProvider>
  )
}

export default App