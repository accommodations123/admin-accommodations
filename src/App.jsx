import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/Loginpage";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import HostingApproval from "./pages/HostingApproval";
import Events from "./pages/Events";
import Carrer from "./pages/Carrer";
// import Buysell from "./pages/Buysell";
import AccommodationCategories from "./pages/AccommodationPages/AccommodationCategories";
import PropertyDetail from "./pages/AccommodationPages/PropertyDetail";
import PropertyList from "./pages/AccommodationPages/PropertyList";

// Import the Buysellpages component
import Buysellpages from "./pages/buysell/Buysellpages";

function App() {
  const isAuth = localStorage.getItem("admin-auth");

  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT ROUTE */}
        <Route path="/" element={isAuth ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

        {/* LOGIN ROUTE */}
        <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <AdminLogin />} />

        {/* DASHBOARD + PROTECTED ROUTES */}
        <Route path="/dashboard" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>

          {/* Dashboard Home */}
          <Route index element={<Dashboard />} />

          {/* Hosting Approval */}
          <Route path="hosting-approval" element={<HostingApproval />} />

          {/* Accommodation Routes */}
          <Route path="accommodation">
            <Route index element={<AccommodationCategories />} />
            <Route path=":categoryName" element={<PropertyDetail />} />
            <Route path=":categoryName/:propertyId" element={<PropertyList />} />
          </Route>

          {/* Events */}
          <Route path="events" element={<Events />} />

          {/* Career */}
          <Route path="career" element={<Carrer />} />

          {/* --- CORRECTED ROUTE --- */}
          {/* Changed path from "Buy and Sell" to "buy-and-sell" to match Sidebar link */}
          {/* <Route path="buy-and-sell" element={<Buysell />} /> */}

          {/* NEW ROUTE FOR BUYSELLPAGES COMPONENT */}
          <Route path="buy-and-sell" element={<Buysellpages />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;