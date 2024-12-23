import React, { useEffect, useState } from 'react'
import './profile.css'
import axios from 'axios'
const Profile = () => {

  const userid = sessionStorage.getItem("userId")
  const [userData, setUserData] = useState({})

  const getApiData = async () => {
    try {
      const res = await axios.get("https://api.mrandmrsperfecttrips.in/api/single-sign-up/" + userid)
      if (res.status === 200) {
        setUserData(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getApiData()
  }, [userid])

  const logout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("Login");
    window.location.href = "/login";
  }
  return (
    <>

      <div className="container profile">
        <h1>My Profile</h1>
        <div className="profile-user-details">
          <div className="prifileContent">
            <p><b>Name</b>: {userData.name}</p>
            <p><b>Email</b>: {userData.email}</p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
              <button onClick={logout} style={{ background: "#7B3226", padding: "5px 20px", borderRadius: "10px", color: "white", fontWeight: 700 }}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* ----Order History---- */}
        <div className="orderHistory">
          <h2>Order History</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Package / Service</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>101</td>
                <td>2024-11-20</td>
                <td>Wireless Mouse</td>
                <td>2</td>
                <td>$40</td>
                <td>Delivered</td>
              </tr>
              <tr>
                <td>102</td>
                <td>2024-11-22</td>
                <td>Bluetooth Speaker</td>
                <td>1</td>
                <td>$60</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <td>103</td>
                <td>2024-11-23</td>
                <td>Gaming Keyboard</td>
                <td>1</td>
                <td>$80</td>
                <td>Processing</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* ----Order History---- end */}
      </div>
    </>
  )
}

export default Profile