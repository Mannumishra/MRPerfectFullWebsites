import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllContactInquery = () => {
    const [data, setData] = useState([])

    const getApiData = async () => {
        try {
            const res = await axios.get("https://api.mrandmrsperfecttrips.in/api/contact")
            console.log(res)
            if (res.status === 200) {
                const newData = res.data.data
                setData(newData.reverse())
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getApiData()
    }, [data.length])
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Contact Query </h4>
                </div>
                {/* <div className="links">
                    <Link to="/add-shop-banner" className="add-new">Add New <i class="fa-solid fa-plus"></i></Link>
                </div> */}
            </div>

            <div className="filteration">
                <div className="selects">
                    {/* <select>
                        <option>Ascending Order </option>
                        <option>Descending Order </option>
                    </select> */}
                </div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="dis-table ">
                <table class="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Message</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item,index) =>
                                <tr>
                                    <th scope="row">{index+1}</th>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phoneNumber}</td>
                                    <td>{item.message}</td>
                                    <td>{new Date(item.createdAt).toLocaleString()}</td>

                                    {/* <td><Link  className="bt edit">Edit <i class="fa-solid fa-pen-to-square"></i></Link></td>
                            <td><Link  className="bt delete">Delete <i class="fa-solid fa-trash"></i></Link></td> */}
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </section>
        </>
    )
}

export default AllContactInquery