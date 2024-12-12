import React from 'react';
import './SuccessPage.css'; // Assuming a CSS file for styling
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/'); // Navigate to the homepage
  };

  return (
    <div className="success-page">
      <div className="success-container">
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Thank you for choosing <span className="brand">MR Mrs Perfect Trip</span>! Your payment was successful, and your booking has been confirmed.
        </p>
        <p className="success-details">
          We hope you have a memorable trip. If you have any questions or require assistance, feel free to contact our support team.
        </p>
        <button className="success-button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;