import React from 'react'

const Header = () => {
  return (
    <header>
      <div className="logo-wrp">
        <img src={'./images/group.png'} alt="company-logo"/>
        <div className="devider"></div>
        <span>Operations</span>
      </div>
      <button name="logout" className="logout">Log Out</button>
    </header>
  )
}

export default Header
