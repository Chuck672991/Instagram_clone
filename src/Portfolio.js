import React from 'react'
import "./Portfolio.css"

function Portfolio() {
  return (
    <div className='portfolio-main'>
    <div className='header'>
        <img src='' alt='logo' />
        <ul className='links'>
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Blog</li>
            <li>More</li>

        </ul>
<button className='btn-nav'>CONTACT</button>
    </div>        
    <div className='portfolio-container'>
    <div className='portfolio-img'>
        <img  src='https://static.vecteezy.com/system/resources/previews/000/224/438/original/selfie-illustration-vector.jpg' alt='Self-pic'/>

    </div>
    <div className='portfolio-content'>
      <div className='headings'>
        <h2>CODEWITHHAIDER</h2>
        <p>I'm a Web</p>
        <h3>Developer</h3>
        </div>
        <div className='paras'>
        <p>Haider Is a good coder and when he ocdes he do it professionaly, he want to be a good delepoper and works very hard to make himself and his parent proud</p>
        <button  className='btn-nav'> Download C.V</button>
        </div>

    </div>
    </div>
    </div>
  )
}

export default Portfolio;
