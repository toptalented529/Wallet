import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/ui/button';
import axios from "axios";
import {
  INITIALIZE_SEED_PHRASE_INTRO_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
  INITIALIZE_SIGN_UP_ROUTE,
} from '../../../../helpers/constants/routes';
import TextField from '../../../../components/ui/text-field';
import { EVENT } from '../../../../../shared/constants/metametrics';

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const alphanumericRegex = RegExp(
  /^[A-Za-z]+$/
);
export default class NewAccount extends PureComponent {
  static contextTypes = {
    trackEvent: PropTypes.func,
    t: PropTypes.func,
  };

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    phone_no: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
    ResponceError: '',
    termsChecked: false,
    otp:'',
    otpDiv: false,
    loadingContinue: false,
    loadingSignUp: false,
    otpMgs:'',
    userAvailable: '',
    formErrors: {
      first_name: '',
      last_name: '',
      phone_no: '',
      email: '',
      message: '',
     
    }
  };

  isValid() {
    const {
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError, isValid
    } = this.state;

    if (!password || !confirmPassword || password !== confirmPassword || this.state.formErrors.first_name.length != 0 || this.state.formErrors.last_name.length != 0 || this.state.formErrors.email.length != 0 || this.state.formErrors.phone_no.length != 0) {
      return false;
    }

    if (password.length < 8) {
      return false;
    }

    return !passwordError && !confirmPasswordError;
  }
  handleOtpChange(otp) {
    console.log(otp)
    this.setState({otp: otp});
    this.isOTPValid()
  }
  isOTPValid() {
    if (this.state.otp.length != 6 ) {
      return false;
    }else{
      return true;
    }
    
  }
  handleContinue = () => {
    this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE);
  };
  handleTextChange(password) {
    const { t } = this.context;

    this.setState((state) => {
      const { confirmPassword } = state;
      let passwordError = '';
      let confirmPasswordError = '';

      if (password && password.length < 8) {
        passwordError = t('passwordNotLongEnough');
      }

      if (confirmPassword && password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return {
        password,
        passwordError,
        confirmPasswordError,
      };
    });
  }
  handlePasswordChange(password) {
    const { t } = this.context;

    this.setState((state) => {
      const { confirmPassword } = state;
      let passwordError = '';
      let confirmPasswordError = '';

      if (password && password.length < 8) {
        passwordError = t('passwordNotLongEnough');
      }

      if (confirmPassword && password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return {
        password,
        passwordError,
        confirmPasswordError,
      };
    });
  }
  handleFirstNameChange = e => {
    e.preventDefault();
    const { name, value } = e.target
    console.log(name, value.length)
    const { t } = this.context;
    let formErrors = { ...this.state.formErrors };

       if (value.length < 3) {
        formErrors.first_name = 'minimum 3 characaters required';
      } else {
        formErrors.first_name = '';
      }

  


    // if (alphanumericRegex.test(value)) {
    //   if (value.length < 3) {
    //     formErrors.first_name = 'minimum 3 characaters required';
    //   } else {
    //     formErrors.first_name = '';
    //   }
    // } else {
    //   if (value.length < 1) {
    //     formErrors.first_name = 'First name canot be empty';
    //   } else {
    //     formErrors.first_name = 'Does not use space and number';
    //   }

    // }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  }
  handleConfirmPasswordChange(confirmPassword) {
    const { t } = this.context;

    this.setState((state) => {
      const { password } = state;
      let confirmPasswordError = '';

      if (password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return {
        confirmPassword,
        confirmPasswordError,
      };
    });
  }


  handelChangeEvent = e => {
    e.preventDefault();
    const { name, value } = e.target
    let formErrors = { ...this.state.formErrors };

    switch (name) {

      case 'last_name':
        formErrors.last_name =
          value.length < 3 ? "minimum 3 characaters required" : "";
        break;

      case 'email':
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      case 'phone_no':
        formErrors.phone_no = phoneregex.test(value)
          ? ""
          : "invalid Phone no";
        break;
      case 'message':
        formErrors.message =
          value.length < 10 ? 'Minumum 10 characaters required' : "";
        break
      default:
        break
    }
    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  }

  handleCreate = async (event) => {
    this.setState({loadingSignUp: true});




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
          if(res.data.Status == 'Match'){
            let formData = {
                    "UserName": this.state.first_name,
                    "Email": this.state.email,
                    "LastName": this.state.last_name,
                    "Password": this.state.confirmPassword,
                  }


      event.preventDefault();
      console.log(formData)
      if (!this.isValid()) {
        return;
      }

      const { password } = this.state;
      const { onSubmit, history } = this.props;
      axios({
        url: process.env.MODULER_API_URI + "/api/user/signup",
        method: "POST",
        data: formData,
      })
        .then(async (res) => {
          // console.log('ress', res.data.UUId);
          this.setState({loadingSignUp: false});
          if (res.status == 200) {
            this.setState({ ResponceError: '' });
            let uuid = res.data.data.UUId
            let userId = res.data.data.UserId
            localStorage.setItem('uuid', uuid);
            localStorage.setItem('userId', userId);
            try {

              await onSubmit(password);

              

              history.replace(INITIALIZE_SIGN_UP_ROUTE);
            } catch (error) {
              this.setState({loadingSignUp: false});
              this.setState({ passwordError: error.message });
            }
          }


        })
        .catch((err) => {
          this.setState({loadingSignUp: false});
          console.log(err.response.data.msg, 'axiox err')
          this.setState({ ResponceError: err.response.data.msg });
        });
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

  toggleTermsCheck = () => {
    this.context.trackEvent({
      category: EVENT.CATEGORIES.ONBOARDING,
      event: 'Check ToS',
      properties: {
        action: 'Create Password',
        legacy_event: true,
      },
    });

    this.setState((prevState) => ({
      termsChecked: !prevState.termsChecked,
    }));
  };

  onTermsKeyPress = ({ key }) => {
    if (key === ' ' || key === 'Enter') {
      this.toggleTermsCheck();
    }
  };

  showOtpDiv = () => {
    console.log('show')
    this.setState({otpDiv: true});
  };
  hideOtpDiv = () => {
    console.log('hide');
    this.setState({otpDiv: false});
  }


  handleContinueWithOtp = async (event) => {
    // console.log(process.env.MODULER_API_URI + "/api/user/signin");
    this.setState({loadingContinue: true});
    this.setState({userAvailable: ''});
    event.preventDefault();
    let formData = {
      "email": this.state.email
    }
    axios({
      url: process.env.MODULER_API_URI + "/api/user/availability",
      method: "POST",
      data: formData,
    })
      .then(async (res) => {
        
        if (res.status == 200) {
          if(res.data.Status == 'Available'){
            let formData = {
              "email": this.state.email,
              "type": "VERIFICATION"
            }
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
        
          }
          // return res
        }
      })
      .catch((err) => {
        this.setState({loadingContinue: false});
        this.setState({userAvailable: 'Email Address is Already Registered '});
        console.log(err, 'axiox err otp')

      });


  };

  render() {
    const { t } = this.context;
    const { formErrors,loadingContinue,loadingSignUp ,otpMgs, otpDiv } = this.state;

    const {
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError,
      termsChecked,
      userAvailable,
    } = this.state;

    return (
      <div>

<div className="container-full" id="container">
			<div className="form-container  sign-in-container">
      <div class="app-header__logo-container2">
        <img src="./images/logo/scallop-wallet-logo.svg" />
      </div>
					<div className="header">Sign up</div>
					 <span className="under__social">
						 <a className="link signup-link">Create your free account on scallop Banknet.</a>
					</span>
					
				<div className="button-input-group">
        <form className="first-time-flow__form" onSubmit={this.handleCreate}>
        <div className={otpDiv ? "disabled button-input-group" : 'button-input-group'}>
          <TextField

            id="f-name"
            placeholder='First Name'
            type="text"
            className="first-time-flow__input text-left"
            onChange={this.handleFirstNameChange}
            name='first_name'
            autoFocus
            margin="normal"
            fullWidth
            largeLabel
          />
          {formErrors.first_name.length > 0 ? <span className="errorMessage">{formErrors.first_name}</span> : ''}

          <TextField
            id="l-name"
            placeholder='Last Name'
            type="text"
            className="first-time-flow__input text-left"
            onChange={this.handelChangeEvent}
            autoFocus
            name='last_name'
            margin="normal"
            fullWidth
            largeLabel
          />
          {formErrors.last_name.length > 0 ? <span className="errorMessage">{formErrors.last_name}</span> : ''}

          <TextField
            id="mail"
            placeholder='Email Id'
            type="email"
            className="first-time-flow__input text-left"
            onChange={this.handelChangeEvent}
            autoFocus
            name='email'
            margin="normal"
            fullWidth
            largeLabel
          />
          <div className="first-time-flow__input text-left errorMessage">{userAvailable}</div>
          {formErrors.email.length > 0 ? <span className="errorMessage">{formErrors.email}</span> : ''}
          <TextField
            id="create-password"
            placeholder={t('newPassword')}
            type="password"
            className="first-time-flow__input text-left"
            value={password}
            onChange={(event) => this.handlePasswordChange(event.target.value)}
            error={passwordError}
            autoFocus
            autoComplete="new-password"
            margin="normal"
            fullWidth
            largeLabel
          />
          <TextField
            id="confirm-password"
            placeholder={t('confirmPassword')}
            type="password"
            className="first-time-flow__input text-left"
            value={confirmPassword}
            onChange={(event) =>
              this.handleConfirmPasswordChange(event.target.value)
            }
            error={confirmPasswordError}
            autoComplete="confirm-password"
            margin="normal"
            fullWidth
            largeLabel
          />
          <div
            className="first-time-flow__checkbox-container"
            onClick={this.toggleTermsCheck}
          >
            <div
              className="first-time-flow__checkbox "
              tabIndex="0"
              role="checkbox"
              onKeyPress={this.onTermsKeyPress}
              aria-checked={termsChecked}
              style={{marginLeft:'25px'}}
              aria-labelledby="ftf-chk1-label"
            >
              {termsChecked ? <i className="fa fa-check fa-2x" /> : null}
            </div>
            <span
              id="ftf-chk1-label"
              className="first-time-flow__checkbox-label"
            >
              {t('acceptTermsOfUse', [
                <a
                  onClick={(e) => e.stopPropagation()}
                  key="first-time-flow__link-text"
                  href="https://metamask.io/terms.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="first-time-flow__link-text">
                    {t('terms')}
                  </span>
                </a>,
              ])}
            </span>
          </div>
          
          

          <div className="first-time-flow__input text-left errorMessage">{this.state.ResponceError}</div>
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

          <button className="signin-btn button" disabled={!this.isOTPValid()} onClick={this.handleCreate} >
            Sign up
            {loadingSignUp && (
              <span >
                <img className='loaderSize' src='./images/button-loader.svg' />
              </span>
            )}
            </button>
          <a className="cursor-pointer" onClick={this.hideOtpDiv}> Cancle</a>
          <a className="cursor-pointer" onClick={this.handleContinueWithOtp}> Generate new otp</a>
          
        </div>
          {/* <Button
            type="primary"
            className="signin-btn"
            disabled={!this.isValid() || !termsChecked || loadingContinue}
            onClick={this.handleContinueWithOtp}
          >
            {t('create')}
          </Button> */}

          <button 
              className={this.state.otpDiv ? "otp-from-group-d-n" : "signin-btn button"}
              disabled={!this.isValid() || !termsChecked || loadingContinue}
              onClick={this.handleContinueWithOtp} >
               Continue
               {loadingContinue && (
                  <span >
                    <img className='loaderSize' src='./images/button-loader.svg' />
                  </span>
                )}
               
              </button>
          <div className="first-time-flow__checkbox-container">
              <span id="ftf-chk1-label" className="first-time-flow__checkbox-label"><span> Already have an account? 
              <a className="cursor-pointer" onClick={this.handleContinue}>
                <span className="first-time-flow__link-text"> Sign in </span></a> </span></span></div>
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





        
        {/* <div className="first-time-flow__create-back">
          <a
            onClick={(e) => {
              e.preventDefault();
              this.context.trackEvent({
                category: EVENT.CATEGORIES.ONBOARDING,
                event: 'Go Back from Onboarding Create',
                properties: {
                  action: 'Create Password',
                  legacy_event: true,
                },
              });
              this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE);
            }}
            href="#"
          >
            {`< ${t('back')}`}
          </a>
        </div>
        <div className="first-time-flow__header">{t('createAccount')}</div>

        <form className="first-time-flow__form" onSubmit={this.handleCreate}>

          <TextField

            id="f-name"
            label='First Name'
            type="text"
            className="first-time-flow__input text-left"
            onChange={this.handleFirstNameChange}
            name='first_name'
            autoFocus
            margin="normal"
            fullWidth
            largeLabel
          />
          {formErrors.first_name.length > 0 ? <span className="errorMessage">{formErrors.first_name}</span> : ''}

          <TextField
            id="l-name"
            label='Last Name'
            type="text"
            className="first-time-flow__input text-left"
            onChange={this.handelChangeEvent}
            autoFocus
            name='last_name'
            margin="normal"
            fullWidth
            largeLabel
          />
          {formErrors.last_name.length > 0 ? <span className="errorMessage">{formErrors.last_name}</span> : ''}

          <TextField
            id="mail"
            label='Email Id'
            type="email"
            className="first-time-flow__input text-left"
            onChange={this.handelChangeEvent}
            autoFocus
            name='email'
            margin="normal"
            fullWidth
            largeLabel
          />
          {formErrors.email.length > 0 ? <span className="errorMessage">{formErrors.email}</span> : ''}
          <TextField
            id="create-password"
            label={t('newPassword')}
            type="password"
            className="first-time-flow__input text-left"
            value={password}
            onChange={(event) => this.handlePasswordChange(event.target.value)}
            error={passwordError}
            autoFocus
            autoComplete="new-password"
            margin="normal"
            fullWidth
            largeLabel
          />
          <TextField
            id="confirm-password"
            label={t('confirmPassword')}
            type="password"
            className="first-time-flow__input text-left"
            value={confirmPassword}
            onChange={(event) =>
              this.handleConfirmPasswordChange(event.target.value)
            }
            error={confirmPasswordError}
            autoComplete="confirm-password"
            margin="normal"
            fullWidth
            largeLabel
          />
          <div
            className="first-time-flow__checkbox-container"
            onClick={this.toggleTermsCheck}
          >
            <div
              className="first-time-flow__checkbox "
              tabIndex="0"
              role="checkbox"
              onKeyPress={this.onTermsKeyPress}
              aria-checked={termsChecked}
              aria-labelledby="ftf-chk1-label"
            >
              {termsChecked ? <i className="fa fa-check fa-2x" /> : null}
            </div>
            <span
              id="ftf-chk1-label"
              className="first-time-flow__checkbox-label"
            >
              {t('acceptTermsOfUse', [
                <a
                  onClick={(e) => e.stopPropagation()}
                  key="first-time-flow__link-text"
                  href="https://metamask.io/terms.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="first-time-flow__link-text">
                    {t('terms')}
                  </span>
                </a>,
              ])}
            </span>
          </div>
          <div className="first-time-flow__input text-left errorMessage">{this.state.ResponceError}</div>
          <Button
            type="primary"
            className="first-time-flow__button"
            disabled={!this.isValid() || !termsChecked}
            onClick={this.handleCreate}
          >
            {t('create')}


          </Button>

        </form> */}
      </div>
    );
  }
}
