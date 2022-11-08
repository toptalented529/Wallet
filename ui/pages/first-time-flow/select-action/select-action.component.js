import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/ui/button';
import MetaFoxLogo from '../../../components/ui/metafox-logo';
import {
  DEFAULT_ROUTE,
  INITIALIZE_SIGN_UP_ROUTE,
  INITIALIZE_METAMETRICS_OPT_IN_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE

} from '../../../helpers/constants/routes';
import Box from '../../../components/ui/box';
import {
  TEXT_ALIGN,
  TYPOGRAPHY,
  JUSTIFY_CONTENT,
  FONT_WEIGHT,
  ALIGN_ITEMS,
} from '../../../helpers/constants/design-system';
import FormField from '../../../components/ui/form-field';

import TextField from '../../../components/ui/text-field';
import axios from "axios";
import {
  tryUnlockMetamask,
  forgotPassword,
  markPasswordForgotten,
  forceUpdateMetamaskState,
  showModal,
} from '../../../../ui/store/actions';
export default class SelectAction extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    isInitialized: PropTypes.bool,
    setFirstTimeFlowType: PropTypes.func,
    nextRoute: PropTypes.string,
  };
  state = {
    user_name: '',
    password: '',
    email: '',
    otp:'',
    otpDiv: false,
    loadingContinue: false,
    otpMgs:'',
    passwordError: '',
    formErrors: {
      user_name: '',
      otpError: '',
    }
  };
  static contextTypes = {
    t: PropTypes.func,
  };

  componentDidMount() {
    const { history, isInitialized, nextRoute } = this.props;

    if (isInitialized) {
      history.push(nextRoute);
    }
  }

  handleCreate = () => {
    this.props.setFirstTimeFlowType('create');
    this.props.history.push(INITIALIZE_METAMETRICS_OPT_IN_ROUTE);
  };

  handleImport = () => {
    this.props.setFirstTimeFlowType('import');
    this.props.history.push(INITIALIZE_METAMETRICS_OPT_IN_ROUTE);
  };
  handleContinue = () => {
    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE);
  };
  showOtpDiv = () => {
    console.log('show')
    this.setState({otpDiv: true});
  };
  hideOtpDiv = () => {
    console.log('hide');
    this.setState({otpDiv: false});
  }

  handelChangeEvent = e => {
    e.preventDefault();
    const { name, value } = e.target
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case 'user_name':
        formErrors.user_name = value.length < 3 ? "minimum 3 characaters required" : "";
        this.isValid()
        break;
      default:
        break
    }

    this.setState({email:value})
    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  }
  handlePasswordChange(password) {
    const { t } = this.context;

    this.setState((state) => {
      let passwordError = '';
      let confirmPasswordError = '';

      if (password && password.length < 8) {
        passwordError = t('passwordNotLongEnough');
      }
      this.isValid()
      return {
        password,
      };
    });
  }
  handleOtpChange(otp) {
    this.isOTPValid()
    this.setState({otp: otp});
  }

  handleContinueWithOtp = async (event) => {
    // console.log(process.env.MODULER_API_URI + "/api/user/signin");
    this.setState({loadingContinue: true});
    let formData = {
      "Email": this.state.email,
      "Password": this.state.password,
    }

    event.preventDefault();


    axios({
      url: process.env.MODULER_API_URI + "/api/user/signin",
      method: "POST",
      data: formData,
    })
      .then(async (res) => {
        if (res.status == 200) {
          console.log('res login',res)
          if(res.data.kycStatus == true){
            this.setState({ passwordError: '' });
            let uuid = res.data.uuid
            let userId = res.data.UserId
            localStorage.setItem('uuid', uuid);
            localStorage.setItem('userId', userId);
            
            let formData = {
              "email": this.state.email,
              "type": "VERIFICATION"
            }
        
            event.preventDefault();
        


            axios({
              url: process.env.MODULER_API_URI + "/api/verification/email",
              method: "POST",
              data: formData,
            })
              .then(async (res) => {
                this.setState({loadingContinue: false});
                if (res.status == 200) {
                  if(res.data.Status == 'Success'){
                    this.showOtpDiv();
                  }
                  // return res
                }
              })
              .catch((err) => {
                this.setState({loadingContinue: false});
                console.log(err, 'axiox err otp')
        
              });
            // console.log('login', getOtp)
          }else{
            this.props.history.replace(INITIALIZE_SIGN_UP_ROUTE);
          }

         
        }
      })
      .catch((err) => {
        this.setState({loadingContinue: false});
        this.setState({ passwordError: 'incorrect username or password' });
        console.log(err, 'axiox err')

      });

  };
  isValid() {
    if (this.state.password.length < 8 || this.state.email.length < 3) {
      return false;
    }else{
      return true;
    }
    
  }

  isOTPValid() {
    if (this.state.otp.length != 6 ) {
      return false;
    }else{
      return true;
    }
    
  }
  
  handleLogin = async (event) => {
    // console.log(process.env.MODULER_API_URI + "/api/user/signin");
    let formData = {
      "email": this.state.email,
      "otp": this.state.otp,
      "type": "VERIFICATION"
    }

    event.preventDefault();
    console.log(formData)

    axios({
      url: process.env.MODULER_API_URI + "/api/verify/email/otp",
      method: "POST",
      data: formData,
    })
      .then(async (res) => {
        if (res.status == 200) {
          // this.setState({ otpMgs: '' });
          console.log('otp res', res)
          


          if(res.data.Status == 'Match'){
            await tryUnlockMetamask(this.state.password);
            this.props.history.push(INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE);
          }else if(res.data.Status == 'notMatch'){
            this.setState({loadingSignUp: false});
            this.setState({ otpMgs: 'invalid Otp' });

          }else if(res.data.Status == 'Expired'){
            this.setState({loadingSignUp: false});
            this.setState({ otpMgs: 'OTP expired' });
          }
        }
      })
      .catch((err) => {
        this.setState({ otpMgs: 'OTP expired' });
        console.log(err, 'axiox err otp')

      });

  };

  render() {
    const { t } = this.context;
    const { loadingContinue ,otpMgs,otpDiv } = this.state;
    return (
      <div>
        {/* <MetaFoxLogo /> */}

        <div className="container-full" id="container">
			<div className="form-container  sign-in-container">
        <div class="app-header__logo-container2">
          <img src="./images/logo/scallop-wallet-logo.svg" />
        </div>
					<div className="header">Sign in</div>
					 <span className="under__social">
						 <a className="link signup-link">Let’s get you logged back in your Banknet.</a>
					</span>
					
				<div className="button-input-group">

        <form className="first-time-flow__form" onSubmit={this.handleLogin}>
              <div className={otpDiv ? "disabled" : null}>
                <TextField
                  id="l-username"
                  placeholder='Email'
                  type="text"
                  className="first-time-flow__input text-left"
                  onChange={this.handelChangeEvent}
                  name='user_name'
                  margin="normal"
                  fullWidth
                />
                <TextField
                  id="enter-password"
                  placeholder='Password'
                  type="password"
                  className="first-time-flow__input text-left"
                  onChange={(event) => this.handlePasswordChange(event.target.value)}
                  autoComplete="new-password"
                  margin="normal"
                  fullWidth
                />
                <p>{this.state.passwordError}</p>
              </div>
              <div className={otpDiv ? "otp-from-group" : "otp-from-group-d-n"}>
                <p>Enter verification code send to Email</p>
                <p>{otpMgs}</p>
                <TextField
                  id="l-otp"
                  placeholder='Enter verification code '
                  type="text"
                  className="first-time-flow__input text-left"
                  onChange={(event) => this.handleOtpChange(event.target.value)}
                  name='email_otp'
                  margin="normal"
                  fullWidth
                />

                <button className="signin-btn button" disabled={!this.isOTPValid()} onClick={this.handleLogin} >Sign In</button>
                <a className="cursor-pointer" onClick={this.hideOtpDiv}> Cancle</a>
                <a className="cursor-pointer" onClick={this.handleContinueWithOtp}> Generate new otp</a>
                
              </div>

              
              <a> Forgot your password?</a>
              {/* <button className="signin-btn button" onClick={this.handleContinueWithOtp} >Continue</button> */}
              <button 
              className={this.state.otpDiv ? "otp-from-group-d-n" : "signin-btn button"}
              disabled={!this.isValid() || loadingContinue}
              onClick={this.handleContinueWithOtp} >
               Continue
               {loadingContinue && (
                  <span >
                    <img className='loaderSize' src='./images/button-loader.svg' />
                  </span>
                )}
               
              </button>

              <div className="first-time-flow__checkbox-container">
                <span id="ftf-chk1-label" className="first-time-flow__checkbox-label">
                  <span> Already have an account? 
                    <a className="cursor-pointer" onClick={this.handleContinue}>
                      <span className="first-time-flow__link-text"> Sign up </span>
                    </a> 
                  </span>
                </span>
              </div>
            
        </form>
        


				</div>
			</div>
			
			
			
			<div className="overlay-container">
				<div className="overlay">
				
					
					<div className="overlay-panel overlay-right">
            <div className="singup_right2">
              <img  src="./images/signup-right-top.png" />
              <h1>World’s first ever <br/> Bank on chain</h1>
              {/* <p>Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.</p> */}
            </div>
          
				
					<img className="singup_right" src="./images/singup_right-bg.png" />
					</div>
				</div>
			</div>
		
			
		</div>




      </div>
    );
  }
}
