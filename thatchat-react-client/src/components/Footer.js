import React from 'react';
import './Footer.css';


const LogoStyle = {
 	height:"32px",
 	width:"32px"
}

function Footer() {
  return (
    <div className="Footer">
        <p> Created by : Peter Rasmussen Lubiana @ <a href="//Lubianainteractive.com" target="_blank"> Lubiana Interactive</a> <img style={LogoStyle} src="CompanyLogo.jpg" alt="A yellow logo saying: Lubiana Interactive" /></p>
    </div>
  );
}

export default Footer;
