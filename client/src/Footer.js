import React from 'react';
import "./App.css";
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className='footer-wrapper'>
            <footer className='footer'>
                <div>
                    <div className="font-bold text-xl">Emmaus Wellness</div>
                    <p>A unique and first of its kind centre in Goa.</p>
                    <div><Link to="/about">About Us</Link> | <Link to="/events">Our Events</Link></div>
                </div>
                <div className='contact-text'>
                    <p>Contact: 9423951027</p>
                    <p>Inquiry: emmausmapusa@outlook.com</p>
                    <p>Address: Emmaus Wellness Centre, Near The Court, Feira Alta, Mapusa, Goa 403507</p>
                </div>
            </footer>
        </div>
    );
}