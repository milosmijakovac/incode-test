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
  TOKEN,
  FINISH_THIRD_PARTY,
  SEND_SMS
} from "../config";
import axios from "axios";

class UserData extends Component {
  state = {
    phone: 0,
    disabled: true,
    imgFront: "",
    imgBack: "",
    token: "",
    onboarding_url: "",
    params: []
  };

  async componentDidMount() {
    let headersConfigStart = {
      "Content-Type": "application/json",
      "api-version": "1.0",
      "x-api-key": CLIENT_SPECIFIC_KEY
    };
    const configStart = {
      method: "post",
      mode: "cors",
      url: `${API_URL}${NEW_SESSION}`,
      data: {
        countryCode: "MX"
      },
      headers: headersConfigStart
    };
    let respStart = await axios(configStart);
    this.setState({
      token: respStart.data.token
    });
  }

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
    let { imgFront, imgBack } = this.state;

    let headersConfigPhone = {
      "Content-Type": "application/json",
      "api-version": "1.0",
      "x-api-key": CLIENT_SPECIFIC_KEY,
      "X-Incode-Hardware-Id": this.state.token
    };

    let headersConfigImage = {
      "Content-Type": "image/jpeg",
      "api-version": "1.0",
      "x-api-key": CLIENT_SPECIFIC_KEY,
      "X-Incode-Hardware-Id": this.state.token
    };

    let headersConfigThirdParty = {
      "Content-Type": "application/json",
      "api-version": "1.0",
      "x-api-key": CLIENT_SPECIFIC_KEY,
      "X-Incode-Hardware-Id": this.state.token
    };

    let headersConfigNotifySendSms = {
      "Content-Type": "application/json",
      "api-version": "1.0",
      "x-api-key": CLIENT_SPECIFIC_KEY,
      "X-Incode-Hardware-Id": this.state.token
    };

    const configPhone = {
      method: "post",
      mode: "cors",
      url: `${API_URL}${ADD_PHONE}`,
      data: {
        phone: "+3813234234"
      },
      headers: headersConfigPhone
    };

    const configImageFront = {
      method: "post",
      mode: "cors",
      url: `${API_URL}${FRONT_ID}`,
      file: imgFront,

      headers: headersConfigImage
    };
    const configImageBack = {
      method: "post",
      mode: "cors",
      url: `${API_URL}${BACK_ID}`,
      file: imgBack,
      headers: headersConfigImage
    };

    const configFinishThirdParty = {
      method: "post",
      mode: "cors",
      url: `${API_URL}${FINISH_THIRD_PARTY}incodetest`,
      data: {},
      headers: headersConfigThirdParty
    };
    const configNotifySendSms = {
      method: "post",
      mode: "cors",
      url: `${API_URL}${SEND_SMS}`,
      data: {
        smsType: "PARTIAL_ONBOARDING",
        params: this.state.params
      },
      headers: headersConfigNotifySendSms
    };

    // let respPhone  = await axios(configPhone)
    try {
      await axios(configPhone);
      let respThirdParty = await axios(configFinishThirdParty);
      let onboarding = [respThirdParty.data.onboardingUrl];

      this.setState({
        params: onboarding
      });

      if(this.state.imgFront !== "") {
        await axios(configImageFront);
      }

      if(this.state.imgBack !== "") {
        await axios(configImageBack);
      }

      let respNotifySms = await axios(configNotifySendSms);
      console.log(respNotifySms);

      this.props.history.push("/next-customer");
    } catch (error) {
      alert("SERVERSKA GRESKA");
    }
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
                <ImageDropBack
                  handleImageBack={imgBack => this.handleImageBack(imgBack)}
                />
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
