import React, { useEffect } from 'react'
import './FlightPage.css'
import DomesticTour from '../DomesticTour/DomesticTour'

function FlightPage() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
        })
    }, [])
    return (
        <DomesticTour />
    )
}

export default FlightPage
