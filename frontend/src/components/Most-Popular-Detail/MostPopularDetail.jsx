import React, { useEffect, useState } from "react";
import "../Most-Popular-Detail/DetailPage.css";
import goa from "../MostPopularTour/goa.jpg";
import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import Slider from "react-slick";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const MostPopularDetail = () => {
  const { _id } = useParams();
  const [data, setData] = useState({});
  const [days, setDays] = useState([]);
  const navigate = useNavigate()
  const getApiData = async () => {
    try {
      let res = await axios.get("https://api.mrandmrsperfecttrips.in/api/package/" + _id);
      const fetchedData = res.data.data;
      setData(fetchedData);
      const dayDetails = [];
      for (let i = 1; i <= 10; i++) {
        if (fetchedData[`day${i}`]) {
          dayDetails.push({ day: `Day ${i}`, detail: fetchedData[`day${i}`] });
        }
      }
      setDays(dayDetails);
    } catch (error) {
      console.log(error);
    }
  };


  const addToCart = () => {
    const cart = JSON.parse(sessionStorage.getItem("mrpackagecart")) || [];
    const isItemInCart = cart.find((item) => item._id === data._id);
    if (!isItemInCart) {
      cart.push({
        _id: data._id,
        packageName: data.packageheading,
        price: data.packagefinal,
        destination: data.packagedestination,
        // discount: data.packagedis,
      });
      sessionStorage.setItem("mrpackagecart", JSON.stringify(cart));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Package added to cart!",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Already in Cart",
        text: "This package is already in your cart!",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };



  var settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    getApiData();
    window.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div className="tripcard">
      <div className="heading">
        <h2>
          {data.packagehighlight}
        </h2>
      </div>
      <Container>
        <Grid container style={{ borderRadius: "1rem", overflow: "hidden" }}>
          <Grid item md={3}>
            <img src={goa} width={"100%"} style={{ height: "100%" }} alt="" />
          </Grid>
          <Grid item md={6} style={{ backgroundColor: "white" }}>
            <Typography
              className="card_center_content"
              style={{ lineHeight: "50px" }}
            >
              <Typography
                variant="h6"
                style={{ color: "rgb(197, 115, 8)", fontWeight: "600" }}
              >
                {data.packageheading}
              </Typography>
              <p>⭐⭐⭐⭐(63 User Rating)</p>
              <div className="destination">
                <p><strong>Destinations :</strong> {data.packagedestination}</p>
              </div>
              <div className=''>
                <p><strong>Highlights :</strong> {data.packagedescription}</p>
              </div>
              <div>
                <p><strong>Package Include :</strong> {data.packageinclude}</p>
              </div>
            </Typography>
          </Grid>
          <Grid
            item
            md={3}
            style={{ backgroundColor: "rgb(21 98 56 / 15%)" }}
            className="lastCard"
          >
            <div>
              <Typography variant="h6">Package Price</Typography>
            </div>
            <div className="price">
              <p style={{ fontWeight: "600", fontSize: "24px" }}>₹{data.packagefinal}</p>
              <p>
                <del
                  style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "gray",
                  }}
                >
                  ₹{data.packageprice}
                </del>
              </p>
            </div>
            <div className="off">{data.packagedis}% Off</div>
            <Typography style={{ margin: "6px" }}>
              Per Person (Taxes extra)
            </Typography>
            <Typography>
              <button className="enquiry" onClick={addToCart}>Add to Cart</button>
            </Typography>
            <Typography>
              <button className="whatsapp"><a href="https://wa.me/+919699862917" target="_blank" rel="noopener noreferrer">WhatsApp Me</a>
              </button>
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <div className="heading">
          <span>{days.length} Days Travel & Tour Services</span>
        </div>
        <Grid container spacing={4}>
          {
            days.map((item, index) =>
              <Grid item md={6} xs={12} key={index}>
                <div
                  style={{
                    padding: "2rem",
                    border: "1px solid #222",
                    borderBottom: "10px solid #222",
                    borderRadius: "2rem",
                  }}
                >
                  <b>Day 0{index + 1}:</b> {item.detail}
                </div>
              </Grid>
            )
          }
        </Grid>
      </Container>
      <Container style={{ padding: "1rem", marginTop: "50px" }}>
        <div className="sliderMain" style={{ margin: "0" }}>
          <Slider {...settings}>
            {data.slideimage &&
              data.slideimage.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`slide ${index}`}
                    style={{ width: "250px", height: "200px", objectFit: "cover" }}  // Fixed width and height
                  />
                </div>
              ))}
          </Slider>
        </div>
      </Container>

    </div>
  );
};

export default MostPopularDetail;
