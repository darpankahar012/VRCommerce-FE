import React from "react";
import axios from "axios";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {bindActionCreators} from "redux";
import {ActCreators} from "../../../redux/bindActionCreator";
import {connect} from "react-redux";
import i18next from "i18next";
import {
    Button,
    Card,
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
import './Forgotpassword.css'
import HomeHeader from "../header/HomeHeader";
import instance from "../../../axios";
import requests from "requests";

let email=null;
const mapStateToProps = state => {
    email= state.email
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(ActCreators, dispatch)
};


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: ''
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    redirectToSingUp = () => {
        const {history} = this.props;
        if (history) history.push('/')
    };

    onForgotPassword= async () => {
        let forgotPasswordUserData = {
            "email": this.state.Email
        };
        const response = await instance.post(requests.fetchForgotPassword, forgotPasswordUserData).catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage)
        });
        
        if (response && response.data) {
            const {history} = this.props;
            let email = response.data.data.email;
                this.props.FORGOT_PASSWORD_EMAIL(email);
                NotificationManager.success('Email Sent');
                setTimeout(() => {
                    history.push('/otpVerification')
                }, 1000)
        }

 /* axios.post(`http://199.43.206.194:6001/api/auth/password/forgot`, forgotPasswordUserData)
            .then(res => {
                let email = res.data.data.email;
                this.props.FORGOT_PASSWORD_EMAIL(email);
                NotificationManager.success('Email Sent');
                setTimeout(() => {
                    history.push('/otpVerification')
                }, 1000)
            }).catch((error) => {
            console.log(error)
        })*/
    }

    render() {
        return (
            <>
                <HomeHeader/>
                <div className="ForgotPassword">
                    <Container fluid>
                        <Row className="justify-content-center">
                            <Col lg="5" md="7">
                                <Card className="shadow border-5"
                                      style={{'backgroundColor': 'rgba(255, 255, 255, 0.7)'}}>
                                    <CardBody className="px-lg-5 py-lg-5">
                                        <div className="text-center text-muted mb-4">
                                            <h3>{i18next.t("Forgot Password")}</h3>
                                        </div>
                                        <Form role="form">
                                            <FormGroup className="mb-3">
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-email-83"/>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input placeholder={i18next.t("Email")} type="email" autoComplete="new-email"
                                                           name="Email" value={this.state.Email}
                                                           onChange={(e) => this.handleChange(e)}/>
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                            </FormGroup>
                                            <div className="text-center">
                                                <Button
                                                    className="my-4"
                                                    onClick={this.redirectToSingUp}
                                                    color="primary" type="button">
                                                    {i18next.t("Login")}
                                                </Button>
                                                <Button className="my-4" color="primary" type="button"
                                                    disabled={!this.state.Email ? true : false}
                                                        onClick={() => this.onForgotPassword()}>
                                                    {i18next.t("Verify Account")}
                                                </Button>

                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <NotificationContainer/>
            </>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
