import React from "react";
import logo from "../../assets/images/logo.png";

const Header = () => {
  return (
    <>
      <div className="col-md-12 logo logo-div top-margin no-padding">
        <img src={logo} alt="logo" className="img-responsive image" />
      </div>
    </>
  );
};

export default Header;
