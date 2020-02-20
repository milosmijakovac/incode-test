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
    params: [],
    filenameFront: "",
    filenameBack: ""
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

  handleImageFront(imgSrcFromDropFront, filenameFront) {
    this.setState({ imgFront: imgSrcFromDropFront, filenameFront });
  }
  handleImageBack(imgSrcFromDropBack, filenameBack) {
    this.setState({ imgBack: imgSrcFromDropBack, filenameBack });
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
    let { imgFront, imgBack, filenameFront, filenameBack } = this.state;

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
      method: "POST",
      mode: "cors",
      body: filenameFront,
      headers: headersConfigImage
    };
    const configImageBack = {
      method: "POST",
      mode: "cors",
      body: filenameBack,
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

    try {
      await axios(configPhone);
      console.log(configPhone);


      if (this.state.imgFront !== "") {
      await fetch(
          "https://stage-api.incodesmile.com/omni/add/front-id",
          configImageFront
        )
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log("error", error));
      }

      if (this.state.imgBack !== "") {
        await fetch(
          "https://stage-api.incodesmile.com/omni/add/back-id",
          configImageBack
        )
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log("error", error));
      }

      let respThirdParty = await axios(configFinishThirdParty);
      let onboarding = [respThirdParty.data.onboardingUrl];

      this.setState({
        params: onboarding
      });


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
                  handleImageFront={(imgFront, filenameFront) =>
                    this.handleImageFront(imgFront, filenameFront)
                  }
                />
              </div>
              <div
                className="back-id"
                id="back-id"
                onClick={this.handleOnClickBackId}
              >
                <ImageDropBack
                  handleImageBack={(imgBack, filenameBack) =>
                    this.handleImageBack(imgBack, filenameBack)
                  }
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
