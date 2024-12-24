import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("mrpackagecart")) || [];
    setCartItems(storedCart);
  }, []);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    sessionStorage.setItem("mrpackagecart", JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    const isLoggedIn = sessionStorage.getItem("Login");
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="shopping-cart">
      <h1>Cart</h1>
      <hr className="mb-3" />

      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Package / Service</th>
              <th>Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="product-details">
                    <div className="product-title">{item.packageName}</div>
                    <p className="product-description">{item.destination || "No description available."}</p>
                  </div>
                </td>
                <td>INR{item.price}</td>
                <td>
                  <button onClick={() => removeFromCart(item._id)} className="remove-product">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="totals">
        <div className="totals-item totals-item-total">
          <label className="grand">Grand Total</label>
          <div className="totals-value" id="cart-total">
            INR {getTotalPrice()}
          </div>
          <button onClick={() => handleCheckout()} className="checkout">
            Checkout
          </button>
        </div>
      </div>

    </div>
  );
};

export default Cart;
