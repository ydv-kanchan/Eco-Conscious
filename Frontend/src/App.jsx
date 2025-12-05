import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import SignUp_Login from "./Components/SignUp_Login";
import SignUp from "./Components/SignUp";
import Home from "./Components/Home";
import ProfileDetails from "./Components/ProfileDetails";
import ProductProfile from "./Components/ProductProfile";
import ProductList from "./Components/ProductList";
import Edit from "./Components/Edit";
import Wishlist from "./Components/Wishlist";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Cart from "./Components/Cart";
import Order from "./Components/Order";
import OrderHistory from "./Components/OrderHistory";
import SearchResults from "./Components/SearchResults";
import Alternative from "./Components/Alternative";
import Bestproduct from "./Components/Bestproduct";
import LearnMore from "./Components/LearnMore";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://eco-conscious.vercel.app"
    : "http://localhost:3000";

function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = token !== null;
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/signup" && (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={<SignUp_Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfileDetails /> : <Navigate to="/" />}
        />
        <Route path="/products/:category" element={<ProductList />} />
        <Route path="/products/:category/:id" element={<ProductProfile />} />
        <Route
          path="/edit"
          element={isAuthenticated ? <Edit /> : <Navigate to="/" />}
        />
        <Route
          path="/wishlist"
          element={isAuthenticated ? <Wishlist /> : <Navigate to="/" />}
        />
        <Route
          path="/cart"
          element={isAuthenticated ? <Cart /> : <Navigate to="/" />}
        />
        <Route path="/bestproduct" element={<Bestproduct />} />
        <Route path="/order/:orderId" element={<Order />} />
        <Route path="/search/:term" element={<SearchResults />} />
        <Route path="/alternatives/:category/:id" element={<Alternative />} />
        <Route
          path="/order-history"
          element={isAuthenticated ? <OrderHistory /> : <Navigate to="/" />}
        />
        <Route path="/learn-more" element={<LearnMore />} />
      </Routes>
      {location.pathname !== "/" && location.pathname !== "/signup" && (
        <Footer />
      )}
    </>
  );
}

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
