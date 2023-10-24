import React, { useEffect } from "react";
import Team from "./scenes/team";
import PropertiesList from "./scenes/team/properties";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  Box,
  CircularProgress,
} from "@mui/material";
import { useMode } from "./theme";
import Dashboard from "./scenes/dashboard";
import { withCookies } from "react-cookie";
import API from "./config/api";
import Sidebar from "./scenes/global/Sidebar";
import Login from "./scenes/auth/login";
import Form from "./scenes/form/users";
import Profile from "./scenes/auth/profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Properties from "./scenes/form/properties";
import Register from "./scenes/auth/register";
import BookingList from "./scenes/team/booking";
import LeadsList from "./scenes/team/leads";
import EnquiriesList from "./scenes/team/enquiry";
import "./App.css";
import Newsletter from "./scenes/team/newsletter";

function App({ cookies }) {
  const [theme] = useMode();
  const api = new API(cookies);
  const [authenticateLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const token = cookies.get("token");

  const validateUser = async () => {
    const response = await api.get("users/profile");
    if (response?.token) {
      cookies.set("token", response.token);
      setUser(response.user);
    } else {
      cookies.remove("token");
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    validateUser();
  }, [cookies]);

  if (authenticateLoading) {
    return (
      <Box
        sx={{
          background: "rgb(242 44 77 / 4%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress
          sx={{
            color: "#f22c4d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "300px",
            height: "300px",
          }}
        />
      </Box>
    );
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {token && user && user.role === "admin" ? (
            <main className="private-main">
              {/* <Topbar setIsSidebar={setIsSidebar} /> */}
              <Box className="private-container" sx={{ display: "flex" }}>
                <Sidebar user={user} />
                <Box sx={{ width: "75%", mx: "auto" }}>
                  <Routes>
                    <Route
                      exact
                      path="/home"
                      element={<Dashboard user={user} />}
                    />
                    <Route path="/form" element={<Form user={user} />} />
                    <Route
                      path="/form/:userId"
                      element={<Form user={user} />}
                    />
                    <Route path="/sub_admins" element={<Team user={user} />} />
                    <Route
                      path="/property"
                      element={<Properties user={user} />}
                    />
                    <Route
                      path="/property/:propertyId"
                      element={<Properties user={user} />}
                    />
                    <Route
                      path="/properties"
                      element={<PropertiesList user={user} />}
                    />
                    <Route
                      path="/bookings"
                      element={<BookingList user={user} />}
                    />
                    <Route path="/leads" element={<LeadsList user={user} />} />
                    <Route
                      path="/enquiries"
                      element={<EnquiriesList user={user} />}
                    />
                    <Route
                      path="/newsletters"
                      element={<Newsletter user={user} />}
                    />
                    <Route
                      path="/profile"
                      element={
                        <Profile user={user} validateUser={validateUser} />
                      }
                    />
                    <Route path="*" element={<Navigate replace to="/home" />} />
                  </Routes>
                </Box>
              </Box>
            </main>
          ) : token && user && user.role === "sub_admin" ? (
            <main className="private-main">
              {/* <Topbar setIsSidebar={setIsSidebar} /> */}
              <Box className="private-container" sx={{ display: "flex" }}>
                <Sidebar user={user} />
                <Box sx={{ width: "75%", mx: "auto" }}>
                  <Routes>
                    <Route
                      exact
                      path="/home"
                      element={<Dashboard user={user} />}
                    />
                    <Route
                      path="/property"
                      element={<Properties user={user} />}
                    />
                    <Route
                      path="/property/:propertyId"
                      element={<Properties user={user} />}
                    />
                    <Route
                      path="/properties"
                      element={<PropertiesList user={user} />}
                    />
                    <Route
                      path="/bookings"
                      element={<BookingList user={user} />}
                    />
                    <Route path="/leads" element={<LeadsList user={user} />} />
                    <Route
                      path="/enquiries"
                      element={<EnquiriesList user={user} />}
                    />
                    <Route
                      path="/newsletters"
                      element={<Newsletter user={user} />}
                    />
                    <Route
                      path="/profile"
                      element={
                        <Profile user={user} validateUser={validateUser} />
                      }
                    />
                    <Route path="*" element={<Navigate replace to="/home" />} />
                  </Routes>
                </Box>
              </Box>
            </main>
          ) : (
            <main className="public-main">
              <div className="public-container">
                <Routes>
                  <Route
                    exact
                    path="/login"
                    element={<Login setUser={setUser} />}
                  />
                  {/* <Route exact path="/register" element={<Register setUser={setUser} />} /> */}
                  <Route path="*" element={<Navigate replace to="/login" />} />
                </Routes>
              </div>
            </main>
          )}
        </Router>
      </ThemeProvider>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnHover={false}
      />
    </>
  );
}

export default withCookies(App);
