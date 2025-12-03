import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/Loginpage";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import HostingApproval from "./pages/HostingApproval";
import AccommodationCategories from "./pages/AccommodationCategories";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyList from "./pages/PropertyList";
import Events from "./pages/Events";
import Carrer from "./pages/Carrer";

function App() {
  const isAuth = localStorage.getItem("admin-auth");

  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT ROUTE */}
        <Route path="/"element={isAuth ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

        {/* LOGIN ROUTE */}
        <Route path="/login"element={isAuth ? <Navigate to="/dashboard" replace /> : <AdminLogin />}/>

        {/* DASHBOARD + PROTECTED ROUTES */}
        <Route path="/dashboard"element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>

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

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
