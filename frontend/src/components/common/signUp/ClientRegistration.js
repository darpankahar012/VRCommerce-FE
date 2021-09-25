
import React from "react";
import axios from "axios";

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Container
} from "reactstrap";
import './SignUp.css'
import HomeHeader from "../header/HomeHeader";


// Api Path
import instance from "../../../axios";
import requests from "../../../requests";

//Phone Number Input
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

// For Redux
import {bindActionCreators} from "redux";
import {ActCreators} from "../../../redux/bindActionCreator";
import {connect} from "react-redux";

// Singin With Social Authentication
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import i18next from "i18next";



const mapStateToProps = state => {
} 

const mapDispatchToProps = dispatch => {
    return bindActionCreators(ActCreators, dispatch)
};

class ClientRegistration extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
       Name:'',
       Email:'',
       Password:'',
       ConfirmPassword:'',
       Address:'',

       Phno:'',
       dial_code:null,
       country_name:'',
       country_code:'',

       currencies:{},
       languages:[],

    }
  }
  handleChangeForPhone = (value, data, event, formattedValue) => {
    this.setState ({
      Phno: formattedValue,
      dial_code: data.dialCode,
      country_name: data.name,
      country_code: data.countryCode
    })
  }
  handleChange (e) {
    this.setState ({
        [e.target.name]: e.target.value
    })
  }

  redirectToLogin (){
    const { history } = this.props;
    if(history) history.push('/')
  }
  onRegisterUser =  async () => {
    axios.get('https://restcountries.eu/rest/v2/callingcode/'+this.state.dial_code+'?fields=name;callingCodes;languages;currencies')
    .then(response => {
      this.setState({
        currencies: response.data[0].currencies[0],
        languages: response.data[0].languages
      }, async () => {
        let currencies = {
          code:this.state.currencies.code.toLowerCase(),
          curr_name:this.state.currencies.name,
          symbol:this.state.currencies.symbol
        }
        let registerUserData = {
          "name": this.state.Name,
          "email" : this.state.Email,
          "password" : this.state.Password,
          "phone":this.state.Phno,
          "dial_code":this.state.dial_code,
          "country_name": this.state.country_name,
          "country_code": this.state.country_code,
          "address": this.state.Address,
          "userType": "client",
          "currencies":currencies,
          "user_languages":this.state.languages,
          "dial_code": this.state.dial_code
        };
        const response = await instance.post(requests.fetchClientRegister, registerUserData )
          .catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage)
        });
    
        if (response && response.data) {
          const {history} = this.props;
            if (history) {
                NotificationManager.success("Registration Successful..!");
                setTimeout(() => {
                    history.push('/')
                }, 2000)
            }
        }
      })
    })
    .catch(error => {
        console.log(error);
    })

    
  }
  responseSuccessGoogle = async (response) => {
    let userData = response.profileObj
    let loginUserData = {
      "socialId": userData.googleId,
      "socialProvider": "Google",
      "email" : userData.email,
      "name": userData.givenName,
      "userType": "client"
    }

    const responseBE = await instance.post(requests.fetchSocialAuthentication, loginUserData).catch((error) => {
      //let errorMessage = error.responseBE.data.error.message;
      NotificationManager.error(error)
    });
    if (responseBE && responseBE.data) {
      let userData = responseBE.data.data.user;
      this.props.LOGIN_USER_DETAIL(userData)
      let token = responseBE.data.data.token
      this.props.TOKEN_KEY(token);
      const {history} = this.props;
      NotificationManager.success('Login Successfully');
      setTimeout(() => {
        if(userData.userType==='admin'){
          history.push('/index');
        }else if(userData.userType==='owner'){
          history.push('/index');
        }else if(userData.userType==='driver'){
          history.push('/order');
        }else{
          history.push('/');
        } 
      }, 2000)
    }
  }
  responseErrorGoogle = (response) => {
      console.log(response);
    }
  responseFacebook = (response) => {
      console.log(response);
  }

  render() {
    const {Name,Email,Password,ConfirmPassword,Phno,Address} = this.state
    return (
      <>
        <HomeHeader/>
        <Container fluid>

        {/* Page content */}
          <div className="SingUP">
            <Row className="justify-content-center">
              <Col lg="6" md="8" sm="8" xm="6">
                <Card className="shadow border-5" style={{'backgroundColor':'rgba(255, 255, 255, 0.7)'}}>
                  <CardHeader className="bg-transparent pb-5">
                    <div className="text-muted text-center mt-2 mb-4">
                      <small>{i18next.t("Sign up with")}</small>
                    </div>
                    <div>
                      <Row >
                      <Col className="btn-wrapper text-center" sm={12} md={3} lg={3}>
                      </Col>
                          <Col className="btn-wrapper text-center" sm={12} md={3} lg={3}>
                            <FacebookLogin
                              type="button"
                              size="small"
                              appId="883904368760310"
                              autoLoad={false}
                              cssClass="kep-login-facebook"
                              //icon="fa fa-facebook" 
                              textButton = "Facebook"
                              //onClick={componentClicked}
                              callback={this.responseFacebook} />
                          </Col>
                          <Col className="btn-wrapper text-center" sm={12} md={3} lg={3}>
                            <GoogleLogin
                              clientId="286274690055-3ir5fktq60nedqvm9nb8lgh0oofgub72.apps.googleusercontent.com"
                              buttonText="Google"
                              onSuccess={this.responseSuccessGoogle}
                              onFailure={this.responseErrorGoogle}
                              cookiePolicy={'single_host_origin'}
                              fetchBasicProfile
                            />
                          </Col>
                      </Row>    
                      </div>
                  </CardHeader>
                  <CardBody className="px-lg-5 py-lg-5">
                    <div className="text-center text-muted mb-4">
                      <small>{i18next.t("Or sign up with credentials")}</small>
                    </div>
                    <Form role="form">
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-hat-3" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Name" type="text"
                            name="Name" value={this.state.Name} onChange = {(e)=>this.handleChange(e)} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Email" type="email" autoComplete="new-email"
                            name="Email" value={this.state.Email} onChange = {(e)=>this.handleChange(e)} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Password" type="password" autoComplete="new-password"
                            name="Password" value={this.state.Password} onChange = {(e)=>this.handleChange(e)} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Confirm Password" type="password"
                            autoComplete="new-password" onChange = {(e)=>this.handleChange(e)}
                            name="ConfirmPassword" value={this.state.ConfirmPassword} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        {/* <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i class="ni ni-mobile-button"></i>
                            </InputGroupText>
                          </InputGroupAddon> 
                           <Input placeholder="Phone Number" type="number"
                            name="Phno" value={this.state.Phno} onChange = {(e)=>this.handleChange(e)} /> */}
                          {/* <PhoneInput
                            country={'us'}
                            value={this.state.Phno}
                            onChange={Phno => this.setState({ Phno })}
                          /> 
                          
                        </InputGroup>*/}
                        
                        <PhoneInput
                          inputProps={{
                            name: 'Phno',
                            required: true,
                          }}
                          placeholder={i18next.t("Enter Phone no")}
                          country={'in'}
                          value={this.state.Phno}
                          autoFormat={false}
                          onChange={ (value, data, event, formattedValue) => this.handleChangeForPhone(value, data, event, formattedValue) }
                        />
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                               <i class="ni ni-pin-3"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="textarea" name="Address" placeholder="Address"
                             value={this.state.Address} onChange = {(e)=>this.handleChange(e)} />
                        </InputGroup>
                      </FormGroup>
                      {/* <div className="text-muted font-italic">
                        <small>
                          password strength:{" "}
                          <span className="text-success font-weight-700">strong</span>
                        </small>
                      </div> */}
                      <Row className="my-4">
                        <Col xs="12">
                          <div className="custom-control custom-control-alternative custom-checkbox">
                            <input
                              className="custom-control-input"
                              id="customCheckRegister"
                              type="checkbox"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheckRegister"
                            >
                              <span className="text-muted">
                                {i18next.t("I agree with the")}{" "}
                                <a href="#pablo">
                                  {i18next.t("Privacy Policy")}
                                </a>
                              </span>
                            </label>
                          </div>
                        </Col>
                      </Row>
                      <div className="text-center">
                        <Button
                          className="mt-4"
                          color="primary"
                          type="button"
                          onClick={() => this.redirectToLogin()} 
                        >
                          {i18next.t("Back to Login")}
                        </Button>
                        <Button className="mt-4" color="primary" type="button"
                          disabled = {(!Name || !Email || !Password || !ConfirmPassword || !Phno || !Address)}
                          onClick= { () =>this.onRegisterUser() }>
                          {i18next.t("Create account")}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
          <NotificationContainer/>
          </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (ClientRegistration);
