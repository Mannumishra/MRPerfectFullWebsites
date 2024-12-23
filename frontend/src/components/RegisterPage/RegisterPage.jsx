import React, { useEffect, useState } from 'react'
import './Register.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import bg from './contact-bg.jpg'

const RegisterPage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, []);
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        number: "",
        email: "",
        password: ""
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === "number") {
            newValue = newValue.replace(/\D/g, '');
            newValue = newValue.slice(0, 10);
        }
        setFormData((prevData) => {
            return { ...prevData, [name]: newValue };
        });

    };

    const handleSubmit = async (event) => {
        setLoading(true)
        event.preventDefault()
        try {
            const response = await axios.post("https://api.mrandmrsperfecttrips.in/api/sign-up", formData)
            if (response.status === 201) {
                toast.success('Sign in Successfully !!')
                navigate("/login")
                setLoading(false)
            }
        }
        catch (err) {
            toast.error(err.response.data.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>

            <section className='login-account'>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6 d-none d-md-block p-0 img-relative">
                            <img src={bg} className='' alt="" />

                        </div>
                        <div className="col-md-6 form-parents p-0">
                            <div className="form">
                                <h3>Sign Up Account </h3>

                                <form onSubmit={handleSubmit}>
                                    <input required type="text" name="name" onChange={handleChange} value={formData.name} placeholder='Name' />
                                    <input required type="number" name="number" onChange={handleChange} value={formData.number} placeholder='Mobile Number' />
                                    <input required type="email" name="email" onChange={handleChange} value={formData.email} placeholder='email Id' />
                                    <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder='password' />

                                    <div className="flex">
                                        <div className="keep">
                                            <i class="fa-solid fa-check"></i> Keep me signed in
                                        </div>
                                        <div className="member">
                                            <Link to="/login">Already a member?</Link>
                                        </div>
                                    </div>

                                    <input type="submit" value="SIGN IN " />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default RegisterPage