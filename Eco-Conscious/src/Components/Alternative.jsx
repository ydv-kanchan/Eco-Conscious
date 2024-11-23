import React, { useEffect, useState } from "react";
import logo from "./download.png";
import axios from "axios";
import "./Styles/congratulationsText.css";
import { Link } from "react-router-dom";

// The main Alternative component
const Alternative = ({ productId, category }) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false); // State for drawer visibility

  // Fetch alternatives when the component mounts or when productId/category changes
  useEffect(() => {
    const fetchAlternatives = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:3000/api/alternatives/${category}/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAlternatives(response.data); // Update state with alternatives
      } catch (error) {
        setError(
          error.response
            ? error.response.data.message || "Failed to fetch alternatives"
            : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId && category) {
      fetchAlternatives();
    }
  }, [category, productId]); // Refetch when category or productId changes

  // Toggle drawer visibility
  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  // Close the drawer
  const closeDrawer = () => {
    setShowDrawer(false);
  };

  return (
    <div style={styles.container}>
      {/* Logo button to show alternatives */}
      <button
        style={styles.logoButton} // Styling for the logo button
        onClick={toggleDrawer} // Toggle alternatives on click
      >
        <img
          src={logo}
          alt="Logo"
          style={styles.logoImage} // Circle logo styling
        />
      </button>

      {/* Sliding drawer for alternatives */}
      <div
        style={{
          ...styles.drawer,
          right: showDrawer ? 0 : "-400px", // Conditional right value
        }}
      >
        <button style={styles.closeButton} onClick={closeDrawer}>
          &times;
        </button>
        <h3 style={styles.title}>Alternatives</h3>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        <div style={styles.alternativeGrid}>
          {alternatives.length === 0 ? (
            <div className="congratulationsText">
              <p>
                Congratulations, you've selected one of the most eco-friendly
                options available!
              </p>
            </div>
          ) : (
            alternatives.map((product) => (
              <Link
                to={`/products/${product.category}/${product._id}`}
                key={product._id}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={closeDrawer} // Close drawer when clicking an alternative
              >
                <div style={styles.alternativeCard}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.alternativeImage}
                  />
                  <h3 style={styles.productName}>{product.name}</h3>
                  <div style={styles.productDetails}>
                    <p style={styles.productPrice}>${product.price}</p>
                    {/* EcoScore in circular progress button */}
                    <LoadingButton ecoScore={product.ecoScore} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Transparent black background overlay */}
      {showDrawer && <div style={styles.overlay} onClick={closeDrawer}></div>}
    </div>
  );
};

// EcoScore button with circular progress
const LoadingButton = ({ ecoScore }) => {
  const [currentScore, setCurrentScore] = useState(0);

  // Loading the score over time for smooth transition
  useEffect(() => {
    let currentScoreValue = 0;
    const interval = setInterval(() => {
      currentScoreValue += 1;
      if (currentScoreValue >= ecoScore) {
        clearInterval(interval);
      }
      setCurrentScore(currentScoreValue);
    }, 5);
  }, [ecoScore]);

  return (
    <div
      style={{
        position: "relative",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="50"
        height="50"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#eeeeee"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#76c893"
          strokeWidth="4"
          fill="none"
          strokeDasharray="125.6"
          strokeDashoffset={125.6 - (125.6 * currentScore) / 100}
          style={{ transition: "stroke-dashoffset 0.2s ease" }}
        />
      </svg>
      <div
        style={{
          zIndex: "2",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#76c893",
        }}
      >
        {currentScore}%
      </div>
    </div>
  );
};

// Styles for the button, drawer, and alternatives section
const styles = {
  container: {
    // padding: "20px",
  },
  logoButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    width: "88px", // Width of the button
    height: "88px", // Height of the button
    borderRadius: "50%", // Make it circular
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Center the logo
    boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.3)", // Optional shadow for button
  },
  logoImage: {
    width: "88px", // Adjust the logo size inside the button
    height: "88px", // Adjust the logo size inside the button
    borderRadius: "50%", // Ensure the logo is round (if logo itself is square)
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: "-500px", // Initially hidden off the screen
    width: "400px",
    height: "100%",
    backgroundColor: "#e7f5e1", // Light green background
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)", // Drawer shadow
    padding: "20px",
    transition: "right 0.6s ease-in-out", // Slower, smooth slide-in transition
    zIndex: 1000, // Ensures it's above other content
    overflowY: "auto",
  },
  closeButton: {
    position: "absolute",
    top: "80px",
    left: "5px",
    background: "transparent",
    border: "none",
    fontSize: "30px",
    cursor: "pointer",
    color: "#333",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  alternativeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Responsive grid layout
    gap: "10px",
    marginLeft: "10px",
  },
  alternativeCard: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    transition: "transform 0.3s ease",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Card shadow for depth
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  alternativeImage: {
    width: "100%",
    height: "200px", // Ensure the image is consistent height
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  productName: {
    fontSize: "18px",
    color: "#333",
    margin: "0px 0px",
  },
  productPrice: {
    color: "#4CAF50",
    fontWeight: "bold",
    margin: "0px 0px",
  },
  ecoScoreContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
  },
  ecoScore: {
    marginLeft: "10px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 500,
  },
};

export default Alternative;