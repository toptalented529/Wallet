
import React, { PureComponent } from 'react';
import axios from "axios";
import {
  INITIALIZE_SEED_PHRASE_INTRO_ROUTE
} from '../../../helpers/constants/routes';
import SumsubWebSdk from '@sumsub/websdk-react'

export default class signUp extends PureComponent {
ß
  constructor(props) {
    super(props);

  }
  state = {
    verifiedSeedPhrase: '',
    accessToken: ''
  };

  componentDidMount() {
    let userId = localStorage.getItem('userId')
    console.log("40 uuid", userId);
    if (userId) {
      axios({
        url: 'https://staging.scallopchain.com/connector/v1/smsb/access-token/Scallop%20Wallet',
        method: "GET",
        headers: { 
          'accept': '*/*', 
          'userId': userId
        }
      })
        // Handle the response from backend here
        .then((res) => {
          console.log("res.data.token", res.data.data);
          if (res.status == 200) {
            console.log("res.status");
            this.setState({
              accessToken: res.data.data.token,
            });
            localStorage.removeItem('userId');
          }
        })
        // Catch errors if any
        .catch((err) => {
          console.log(err, 'axiox err')
        });


    }

  }


  handleLogin = async () => {
  }


  login = (isKYCDone) => {
    const { history } = this.props;
    let uuid = localStorage.getItem('uuid')

    axios({
      url: process.env.MODULER_API_URI + "/api/login",
      method: "POST",
      data: { "UUID": uuid, "kycDone": isKYCDone },
    })
      .then(async (res) => {
        if (res.status == 201) {
          console.log("90 res", res)

      
          history.replace(INITIALIZE_SEED_PHRASE_INTRO_ROUTE);
        }
      })
      .catch((err) => {
        console.log(err, 'axiox err')

      });
    // history.replace(INITIALIZE_END_OF_FLOW_ROUTE);

  };

  handleSubmit = async () => {
    this.login(false)
  };
  handleSubmit2 = async () => {
    const { history } = this.props;
    let uuid = localStorage.getItem('uuid')

    axios({
      url: process.env.MODULER_API_URI + "/api/login-with-kyc",
      method: "POST",
      data: { "UUID": uuid },
    })
      .then(async (res) => {
        debugger;
        console.log('KYC data', res.status)
        if(res.status == 200){
          history.replace(INITIALIZE_SEED_PHRASE_INTRO_ROUTE);
        }
      })
      .catch((err) => {
        console.log(err, 'axiox err')

      });
  };

  render() {

    return (
      <div className="sumsub-main">
        {/* <p> check access token {this.state.accessToken}</p> */}
        {this.state.accessToken ? (
          <SumsubWebSdk
            accessToken={this.state.accessToken}
            updateAccessToken={() => console.log("updateAccessToken")}
            expirationHandler={() => Promise.resolve(this.state.accessToken)}
            config={{
              lang: "en",
              // levelName: "Scallop Wallet",
              // email: applicantEmail,
              // phone: applicantPhone,
              i18n: {
                document: {
                  subTitles: {
                    IDENTITY: "Upload a document that proves your identity"
                  }
                }
              },
              uiConf: {
                customCssStr:
                  ":root {\n  --black: #000000;\n   --grey: #F5F5F5;\n  --grey-darker: #B2B2B2;\n  --border-color: #DBDBDB;\n}\n\np {\n  color: var(--black);\n  font-size: 16px;\n  line-height: 24px;\n}\n\nsection {\n  margin: 40px auto;\n}\n\ninput {\n  color: var(--black);\n  font-weight: 600;\n  outline: none;\n}\n\nsection.content {\n  background-color: var(--grey);\n  color: var(--black);\n  padding: 40px 40px 16px;\n  box-shadow: none;\n  border-radius: 6px;\n}\n\nbutton.submit,\nbutton.back {\n  text-transform: capitalize;\n  border-radius: 6px;\n  height: 48px;\n  padding: 0 30px;\n  font-size: 16px;\n  background-image: none !important;\n  transform: none !important;\n  box-shadow: none !important;\n  transition: all 0.2s linear;\n}\n\nbutton.submit {\n  min-width: 132px;\n  background: none;\n  background-color: var(--black);\n}\n\n.round-icon {\n  background-color: var(--black) !important;\n  background-image: none !important;\n}"
              },
              onError: (error) => {
                console.error("WebSDK onError", error);
              }
            }}
            options={{ addViewportTag: false, adaptIframeHeight: true }}
            onMessage={(type, payload) => {
              console.log("payload.reviewResult", payload);
              if (payload.reviewResult.reviewAnswer == "GREEN") {

                if (payload.reviewStatus == "completed") {
                  console.log("Approved");
                  this.handleSubmit()
                }
              }
              if (payload.reviewResult.reviewAnswer == "RED") {
                if (payload.reviewStatus == "completed") {
                  if (payload.reviewRejectType == "FINAL") {
                    console.log("RED | completed | FINAL ");
                  } else if (payload.reviewRejectType == "RETRY") {
                    console.log("RED | completed | RETRY ");
                  }
                }
                if (payload.reviewStatus == "RED") {
                  if (payload.reviewRejectType == "RETRY") {
                    console.log("RED | onHold | FINAL ");
                  } else if (payload.reviewRejectType == "RETRY") {
                    console.log("RED | onHold | RETRY ");
                  }
                }
              }
              if (payload.applicantId) {
                console.log("Approved");
                this.handleSubmit()
              }
            }}
            onError={(data) => console.log("onError", data)}
          />
        ) : (
          <p>Wait</p>
        )}

        {/* <button onClick={() => { this.login(false) }}>Login</button> */}
        {/* <button onClick={this.handleSubmit2}>kycTest</button> */}

      </div>
    );
  }
}
