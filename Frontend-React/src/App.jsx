import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./Redux/Auth/Action";

import Navbar from "./pages/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Portfolio from "./pages/Portfilio/Portfolio";
import Auth from "./pages/Auth/Auth";
import StockDetails from "./pages/StockDetails/StockDetails";
import Profile from "./pages/Profile/Profile";
import Notfound from "./pages/Notfound/Notfound";
import Wallet from "./pages/Wallet/Wallet";
import Watchlist from "./pages/Watchlist/Watchlist";
import TwoFactorAuth from "./pages/Auth/TwoFactorAuth";
import ResetPasswordForm from "./pages/Auth/ResetPassword";
import PasswordUpdateSuccess from "./pages/Auth/PasswordUpdateSuccess";
import PaymentSuccess from "./pages/Wallet/PaymentSuccess";
import Withdrawal from "./pages/Wallet/Withdrawal";
import PaymentDetails from "./pages/Wallet/PaymentDetails";
import WithdrawalAdmin from "./Admin/Withdrawal/WithdrawalAdmin";
import Activity from "./pages/Activity/Activity";
import SearchCoin from "./pages/Search/Search";
import AdminHome from "./Admin/AdminHome";

import { shouldShowNavbar } from "./Util/shouldShowNavbar";
import { Toaster } from "@/components/ui/toaster";
import ParticlesBackground from "./components/custome/ParticlesBackground"

const routes = [
  { path: "/", role: "ROLE_USER" },
  { path: "/portfolio", role: "ROLE_USER" },
  { path: "/activity", role: "ROLE_USER" },
  { path: "/wallet", role: "ROLE_USER" },
  { path: "/withdrawal", role: "ROLE_USER" },
  { path: "/payment-details", role: "ROLE_USER" },
  { path: "/wallet/success", role: "ROLE_USER" },
  { path: "/market/:id", role: "ROLE_USER" },
  { path: "/watchlist", role: "ROLE_USER" },
  { path: "/profile", role: "ROLE_USER" },
  { path: "/search", role: "ROLE_USER" },
  { path: "/admin/home", role: "ROLE_ADMIN" },
  { path: "/admin/withdrawal", role: "ROLE_ADMIN" },
];

function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(getUser(localStorage.getItem("jwt")));
  }, [auth.jwt]);

  useEffect(() => {
    if (auth.user?.role === "ROLE_ADMIN" && location.pathname === "/") {
      navigate("/admin");
    }
  }, [auth.user, location, navigate]);

  const showNavbar = auth.user
    ? shouldShowNavbar(location.pathname, routes, auth.user?.role)
    : false;

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Фон с частицами */}
      <ParticlesBackground />

      {/* Основной контент сайта */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {auth.user ? (
          <>
            {showNavbar && <Navbar />}
            <Routes>
              {/* Твои маршруты пользователя */}
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/withdrawal" element={<Withdrawal />} />
              <Route path="/payment-details" element={<PaymentDetails />} />
              <Route path="/wallet/:order_id" element={<Wallet />} />
              <Route path="/market/:id" element={<StockDetails />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<SearchCoin />} />
              {/* Админские маршруты */}
              <Route path="/admin" element={<Navigate to="/admin/home" replace />} />
              <Route path="/admin/home" element={<AdminHome />} />
              <Route path="/admin/withdrawal" element={<WithdrawalAdmin />} />
              {/* 404 */}
              <Route path="*" element={<Notfound />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/signin" element={<Auth />} />
            <Route path="/forgot-password" element={<Auth />} />
            <Route path="/reset-password/:session" element={<ResetPasswordForm />} />
            <Route path="/password-update-successfully" element={<PasswordUpdateSuccess />} />
            <Route path="/two-factor-auth/:session" element={<TwoFactorAuth />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        )}
        <Toaster />
      </div>
    </div>
  );
}

export default App;
