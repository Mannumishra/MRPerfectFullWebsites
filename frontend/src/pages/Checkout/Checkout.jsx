import React, { useState, useEffect } from "react";
import "./checkout.css";
import Swal from "sweetalert2";
import axios from "axios";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const userId = sessionStorage.getItem("userId"); // Correct key to get userId from sessionStorage
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("mrpackagecart")) || [];
    setCart(storedCart);

    // Calculate the total amount correctly from cart
    const total = storedCart.reduce((total, item) => total + item.price, 0);
    setTotalAmount(total); // Update state with total amount
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCheckout = async () => {
    try {
      const checkoutData = {
        userId,
        cartItems: cart.map((item) => ({
          productId: item._id,
          packageName: item.packageName,
          price: item.price,
          destination: item.destination,
        })),
        totalAmount, // Send correct totalAmount to backend
        shippingAddress: shippingDetails,
      };

      const { data } = await axios.post("https://api.mrandmrsperfecttrips.in/api/checkout", checkoutData);
      console.log(data)
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Checkout Successful",
          text: "Proceed to payment",
          timer: 2000,
          showConfirmButton: false,
        });

        // Trigger Razorpay Payment
        const options = {
          key: "rzp_test_o2zsKLnzNlKhCW", // Razorpay Key ID
          amount: data.amount, // Amount in paise (INR * 100)
          currency: data.currency,
          order_id: data.razorpayOrderId,
          handler: function (response) {
            verifyPayment(response, data.checkoutId); // Verify payment after successful transaction
          },
          prefill: {
            name: shippingDetails.name,
            email: shippingDetails.email,
            contact: shippingDetails.phone,
          },
          notes: {
            address: shippingDetails.address,
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Something went wrong during checkout.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const verifyPayment = async (paymentData, checkoutId) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentData;
      const response = await axios.post("https://api.mrandmrsperfecttrips.in/api/verify-payment", {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        checkoutId,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: "Your order has been placed.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: response.data.error || "Something went wrong during payment verification.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong during payment verification.",
      });
    }
  };

  return (
    <section className="checkoutPage">
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Checkout</h2>
          <form>
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={shippingDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={shippingDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone number</label>
              <input
                type="number"
                name="phone"
                placeholder="+91 123 456 7890"
                value={shippingDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingDetails.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingDetails.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pin Code</label>
                <input
                  type="number"
                  name="pincode"
                  placeholder="Pin Code"
                  value={shippingDetails.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </form>
        </div>
        <div className="cart-review">
          <h2>Review your cart</h2>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>{item.packageName}</td>
                  <td>INR{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="totals">
            <h3>Total: INR{totalAmount}</h3>
          </div>
          <button className="pay-button" onClick={handleCheckout}>
            Pay Now
          </button>
          <p className="secure-checkout">Secure Checkout - SSL Encrypted</p>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
