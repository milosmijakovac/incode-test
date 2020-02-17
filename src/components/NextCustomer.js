import React from "react";
import { Link } from "react-router-dom";

function NextCustomer() {
  return (
    <div className="customer-wrapper">
      <div className="customer-info">
        <img src="./images/group-3.png" alt="" />
        <p className="sms-sent">SMS Sent</p>
        <p className="sms-receive-info">
          The customer will receive an SMS to complete the onboarding
        </p>
      </div>
      <button className="next-customer-btn"><Link to="/">NEXT CUSTOMER</Link></button>
    </div>
  );
}

export default NextCustomer;
