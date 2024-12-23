import React, { useEffect } from 'react'
import './LoginPage.css'
import { useState } from 'react'
import axios from 'axios'
import bg from './bg.png'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

function LoginPage() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, []);
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        setLoading(true)
        event.preventDefault()
        try {
            const response = await axios.post("https://api.mrandmrsperfecttrips.in/api/login", formData)
            console.log(response)
            if (response.status === 200) {
                toast.success('Login SuccessFull')
                sessionStorage.setItem("userId", response.data.data._id)
                sessionStorage.setItem("Login", true)
                const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
                if (redirectUrl) {
                    sessionStorage.removeItem("redirectAfterLogin");
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = "/"
                }
            }
            setLoading(false)
        }
        catch (err) {
            console.log(err.response.data.message);
            toast.error(err.response.data.message)
            setLoading(false)
        }
    }
    return (
        <>
            {loading ? (
                // <Loading />
                <div>Loading</div>
            ) : (<section className='login-account'>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6 d-none d-md-block p-0 img-relative">
                            <img src={bg} className='' alt="" />

                            {/* <div className="img-absolute ">
                                <h2>Welcome to <br /> Camro </h2>
                                <p></p>
                            </div> */}
                        </div>
                        <div className="col-md-6 form-parents p-0">
                            <div className="form">
                                <h3>Login in Account </h3>
                                {/* <p className='mt-[-22px]'>
                                    Discover the finest Utensils Brand, offering unparalleled quality and innovation to elevate your culinary experience to new heights.
                                </p> */}

                                <form onSubmit={handleSubmit}>
                                    <input required type="email" name="email" onChange={handleChange} value={formData.email} placeholder='email Id' />
                                    <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder='password' />

                                    <div className="flex">
                                        <div className="keep">
                                            <i class="fa-solid fa-check"></i> Keep me signed in
                                        </div>
                                        <div className="member">
                                            <Link to="/register">Create Account</Link>
                                        </div>
                                    </div>

                                    <input type="submit" value="SIGN IN " />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>)}

        </>
    )
}

export default LoginPage
