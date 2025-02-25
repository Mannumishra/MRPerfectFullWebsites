import React, { useEffect, useState } from "react";
import "./Categorytour.css";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Categorytour = () => {
  const [data, setData] = useState([]);
  const { key } = useParams();

  const getApiData = async () => {
    try {
      let res = await axios.get(
        "https://api.mrandmrsperfecttrips.in/api/package"
      );
      if (res.status === 200) {
        console.log(res);
        const newData = res.data.data;
        const filterData = newData.filter(
          (x) => x.packagecity.trim() === key.trim()
        );
        setData(filterData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo({
        top:0,
    })
    getApiData();
  }, [key]);

  return (
    <section className="mostpopular-section">
      <div className="popular-container">
        <div className="heading">
          <h2>
            TAKE A LOOK AT OUR <span>{key} POPULAR</span> TOURS
          </h2>
        </div>
        {data.length ? (
          <div className="main-container">
            {data.map((item, index) => (
              <div className="col" key={index}>
                <Link to={`/Our-Tour-Package-Detail/${item._id}`}>
                  <div className="img">
                    <img src={item.pic} alt={item.packagecity} />
                  </div>
                  <div className="info">
                    <p>
                      <span
                        className="uppercase"
                        style={{
                          color: "orange",
                          fontSize: 20,
                          fontWeight: "700",
                        }}
                      >
                        {item.packagedestination}
                      </span>
                    </p>
                    <p>
                      <span className="uppercase">{item.packageheading}</span>
                    </p>
                    <p>
                    Package Price INR {item.packagefinal}
                    </p>
                    <button
                      style={{ color: "navy", fontSize: 16, fontWeight: "500", backgroundColor:"orange", padding:'0px 10px' , borderRadius:'1rem' , marginTop:'0.5rem' }}
                    >
                      View More
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="text-center">
            {`No packages available for this ${key} city .`}
          </h3>
        )}
      </div>
    </section>
  );
};

export default Categorytour;
