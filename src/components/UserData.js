import React, { Component } from "react";
import ImageDropFront from "./ImageDropFront";
import ImageDropBack from "./ImageDropBack";
import {
  API_URL,
  ADD_PHONE,
  NEW_SESSION,
  FRONT_ID,
  BACK_ID,
  CLIENT_SPECIFIC_KEY,
  TOKEN
} from "../config";
import axios from "axios";

class UserData extends Component {
  state = {
    phone: 0,
    disabled: true,
    imgFront: "",
    imgBack: ""
  };

  handleImageFront(imgSrcFromDropFront) {
    this.setState({ imgFront: imgSrcFromDropFront });
  }
  handleImageBack(imgSrcFromDropBack) {
    this.setState({ imgBack: imgSrcFromDropBack });
  }

  handleOnClickFrontId = () => {
    const paragraphInput = document.querySelector(".front");

    paragraphInput.classList.toggle("visible");
  };
  handleOnClickBackId = () => {
    const paragraphInput = document.querySelector(".back");

    paragraphInput.classList.toggle("visible");
  };

  fetchResult = async () => {
    let {imgFront, imgBack} = this.state;
    let headersConfig = {
      "Content-Type": "application/json",
      "api-version": "1.0",
      "x-api-key": CLIENT_SPECIFIC_KEY,
      "X-Incode-Hardware-Id": TOKEN
    };
    let headersConfigImage = {
      "Content-Type": "image/jpeg",
      "api-version": "1.0",
      "x-api-key": CLIENT_SPECIFIC_KEY,
      "X-Incode-Hardware-Id": TOKEN
    };

    const config = {
      method: "post",
      mode: "cors",
      url: `${API_URL}${ADD_PHONE}`,
      data: {
        phone: "+3813234234"
      },
      headers: headersConfig
    };

    const config2 = {
      method: "post",
      mode: "cors",
      url: `${API_URL}${FRONT_ID}`,
      data: {
        imgFront
      },
      headers: headersConfigImage
    };
    const config3 = {
      method: "post",
      mode: "cors",
      url: `${API_URL}${BACK_ID}`,
      data: {
        imgBack
      },
      headers: headersConfigImage
    };

    let res = axios(config);
    res.then(res => console.log(res));

    
  };

  handleSubmit = e => {
    e.preventDefault();
    this.fetchResult();
  };

  handleInputChange = e => {
    e.preventDefault();
    let { name, value } = e.target;
    this.setState(
      {
        [name]: value
      },
      () => {
        let { phone } = this.state;
        if (phone.length >= 7) {
          this.setState({ disabled: false });
        } else {
          this.setState({ disabled: true });
        }
      }
    );
  };

  render() {
    const { phone, disabled } = this.state;

    let classes = "send-sms";
    classes += phone.length >= 7 ? " btn-blue" : "";
    console.log(classes);

    return (
      <div className="user-data">
        <div className="data-inputs">
          <p>Enter phone number</p>
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="phone" onChange={this.handleInputChange} />
            <div className="user-id">
              <p>
                Drag and drop or upload the photos from your files{" "}
                <span>(optional)</span>
              </p>
              <div
                className="front-id"
                id="front-id"
                onClick={this.handleOnClickFrontId}
              >
                <ImageDropFront
                  handleImageFront={imgFront => this.handleImageFront(imgFront)}
                />
              </div>
              <div
                className="back-id"
                id="back-id"
                onClick={this.handleOnClickBackId}
              >
                <ImageDropBack handleImageBack={imgBack => this.handleImageBack(imgBack)} />
              </div>
            </div>
            <button className={classes} type="submit" disabled={disabled}>
              SEND SMS
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default UserData;
