import React from 'react'
import  './Navbar.css'
import navlogo from '../../assets/navlogo.avif'
import navProfile from '../../assets/navprofile.png'
const Navbar = () => {
  return (
    <div className='navbar'>
     <img src={navlogo} className="nav-logo" alt="" />
     <img src={navProfile}  className="nav-profile" alt="" />
    </div>
  )
}

export default Navbar