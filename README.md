# GJ Enterprise - Multi-Module Architecture

This project is organized into three distinct, decoupled modules:
1. **`backend/`** - Java Spring Boot REST API
2. **`frontend/`** - Customer-facing Travel & Enquiry Website (React + Vite)
3. **`admin/`** - Admin Dashboard & Enquiry Management Portal (React + Vite)

---

## 📁 Project Structure

```
gjenterprise/
├── backend/                  # Java Spring Boot 4 / 3 (Port: 8080)
│   ├── src/                  # Controllers, Entities, Repositories, Security, Services
│   ├── pom.xml               # Maven configuration
│   └── mvnw / mvnw.cmd       # Maven Wrapper scripts
│
├── frontend/                 # Customer Web App (Port: 5173)
│   ├── src/                  # Home, About, Destinations, Services, Contact & Enquiries
│   ├── package.json
│   └── vite.config.js        # Port 5173 with proxy to backend
│
├── admin/                    # Admin Management App (Port: 5174)
│   ├── src/                  # Admin Login & Enquiries Management Dashboard
│   ├── package.json
│   └── vite.config.js        # Port 5174 with proxy to backend
│
├── .gitignore                # Global git ignore configuration
└── README.md                 # Project documentation
```

---

## 🚀 How to Run the Applications

Open 3 separate terminals (or terminal tabs) to run each service:

### 1. Run Backend (Spring Boot)
Ensure MySQL is running on `localhost:3306` with database `gj_enterprise` (configured in `backend/src/main/resources/application.properties`).

```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows Command Prompt / PowerShell, you can also run: `mvnw.cmd spring-boot:run`)*

- **Backend URL:** `http://localhost:8080`
- **Default Admin Account:** Initialized automatically by `DataInitializer` (`admin@gjenterprise.com` / `Admin@123`)

---

### 2. Run Customer Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- **Frontend URL:** `http://localhost:5173`
- Features: View destinations, explore services, submit travel enquiries.

---

### 3. Run Admin Portal (React + Vite)

```bash
cd admin
npm install
npm run dev
```

- **Admin Portal URL:** `http://localhost:5174`
- Features: Admin authentication (JWT), view all enquiries, change status (Pending/Contacted/Confirmed/Completed), delete enquiries, and filter/search.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Admin login, returns JWT token |
| `POST` | `/api/enquiries` | Public | Customer submits travel enquiry |
| `GET` | `/api/enquiries` | Admin (Bearer Token) | Get all enquiries |
| `GET` | `/api/enquiries/{id}` | Admin (Bearer Token) | Get enquiry by ID |
| `PUT` | `/api/enquiries/{id}?status=...` | Admin (Bearer Token) | Update enquiry status |
| `DELETE`| `/api/enquiries/{id}` | Admin (Bearer Token) | Delete an enquiry |
