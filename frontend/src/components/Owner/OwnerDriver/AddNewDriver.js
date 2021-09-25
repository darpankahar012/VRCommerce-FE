import React, { Component } from "react";
import axios from "axios";
//reactstrap
import {
  Button,
  Modal,
  FormGroup,
  Input,
  Card,
  CardBody,
  Label,
} from "reactstrap";

// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";


import i18next from "i18next"

//Phone Number Input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";
import { Link } from "react-router-dom";

let token = null;

const mapStateToProps = (state) => {
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class AddNewDriver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      dial_code: null,
      country_name: "",
      country_code: "",

      currencies: {},
      languages: [],
    };
  }

  oncloseModal = () => {
    this.props.onClose();
    this.setState({
      name: "",
      email: "",
      phone: "",
    });
  };

  handleChangeForPhone = (value, data, event, formattedValue) => {
    this.setState(
      {
        phone: formattedValue,
        dial_code: data.dialCode,
        country_name: data.name,
        country_code: data.countryCode,
      },
      () => {
        console.log("1",this.state)
        axios
          .get(
            `https://restcountries.eu/rest/v2/callingcode/${this.state.dial_code}?fields=name;callingCodes;languages;currencies`
          )
          .then((response) => {
            this.setState(
              {
                currencies: response.data[0].currencies[0],
                languages: response.data[0].languages,
              }
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  };

  handleChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => {
        console.log("Set restaurant State :", this.state);
      }
    );
  };

  AddNewDriverOwner = async () => {
    const data = {
      name: this.state.name,
      phone: this.state.phone,
      email: this.state.email,
      dial_code: this.state.dial_code,
      country_name: this.state.country_name,
      country_code: this.state.country_code,
      user_languages: this.state.languages,
      currencies: {
        code: this.state.currencies.code,
        curr_name: this.state.currencies.name,
        symbol: this.state.currencies.symbol,
      },
    };
    console.log(data)
    const response = await instance
      .post(requests.fetchAddDriverFromOwner, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        console.log(errorMessage);
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.props.getDriverOwner();
      this.setState(
        {
          name: "",
          email: "",
          phone: "",
        },
        () => {
          this.props.onClose();
        }
      );
    }
  };

  render() {
    return (
      <>
        <Modal className="modal-dialog-centered" isOpen={this.props.show}>
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {i18next.t("Add new Driver")}
            </h5>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.oncloseModal}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body p-0">
            <Card className="bg-secondary shadow border-0">
              <CardBody className="p-lg-5">
                <FormGroup className="pb-3">
                  <Label for="Name">{i18next.t("Name")}</Label>
                  <Input
                    className="px-2 py-4"
                    type="text"
                    placeholder={i18next.t("Driver Name")}
                    name="name"
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <FormGroup className="pb-3">
                  <Label for="email">{i18next.t("email")}</Label>
                  <Input
                    className="px-2 py-4"
                    type="email"
                    placeholder={i18next.t("Add Email Id")}
                    name="email"
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <FormGroup className="pb-3">
                  <Label for="phone">{i18next.t("Phone Number")}</Label>
                  {/* <Input
                    className="px-2 py-4"
                    type="number"
                    placeholder=" Add Phone Number"
                    name="phone"
                    onChange={this.handleChange}
                  /> */}
                  <PhoneInput
                    inputProps={{
                      name: "phone",
                      required: true,
                      autoFocus: true,
                    }}
                    inputStyle={{ width: "100%" }}
                    placeholder={i18next.t("Enter Phone no")}
                    country={"in"}
                    value={this.state.phone}
                    autoFormat={false}
                    onChange={(value, data, event, formattedValue) =>
                      this.handleChangeForPhone(
                        value,
                        data,
                        event,
                        formattedValue
                      )
                    }
                  />
                </FormGroup>

                <div className="text-center my-">
                  <Button
                    className="my-3 p-3"
                    color="primary"
                    type="button"
                    onClick={this.AddNewDriverOwner}
                  >
                    {i18next.t('save')}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
          <NotificationContainer/>
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewDriver);
