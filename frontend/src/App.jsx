
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import About from './pages/About'
import Destinations from './pages/Destinations'
import Services from './pages/Services'
import Contact from './pages/Contact'

import AdminLogin from './components/Admin/AdminLogin'
import AdminDashboard from './components/Admin/AdminDashboard'

import './App.css'


function AdminPage() {
  const token = localStorage.getItem('token')

  return token ? <AdminDashboard /> : <AdminLogin />
}


function App() {
  return (
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


        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminPage />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App