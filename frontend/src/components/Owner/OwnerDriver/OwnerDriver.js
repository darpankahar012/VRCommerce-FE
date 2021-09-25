import React, { Component } from "react";
import axios from "axios";
import AddNewDriver from "./AddNewDriver";

//Loder
import Loader from "../../common/Loader";

import ExportCsv from "./ExportCsv";

//Phone Number Input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

// reactstrap components
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Button,
  Table,
  CardBody,
  Modal,
  Form,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import i18next from "i18next";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";
import { Link } from "react-router-dom";

let token = null;
let pageLinks = [];
let numberOfPages = 0;

const mapStateToProps = (state) => {
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class OwnerOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driverShow: false,
      LoaderShow: true,
      EditDriverShow: false,
      EditName: null,
      Editemail: null,
      Editphone: null,
      dial_code: null,
      country_name: "",
      country_code: "",

      currencies: {},
      languages: [],
    };
  }
  handleChangeForPhone = (value, data, event, formattedValue) => {
    this.setState(
      {
        Editphone: formattedValue,
        dial_code: data.dialCode,
        country_name: data.name,
        country_code: data.countryCode,
      },
      () => {
        axios
          .get(
            `https://restcountries.eu/rest/v2/callingcode/${this.state.dial_code}?fields=name;callingCodes;languages;currencies`
          )
          .then((response) => {
            let languages = [];
            response.data[0].languages.map((data, i) => {
              languages.push(data.name);
            });
            this.setState(
              {
                currencies: response.data[0].currencies[0],
                languages: languages,
              }
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  };

  getDriverOwner = async () => {
    const response = await instance
      .get(requests.fetchGetDriverOwner, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.responses.data.message;
        console.log(errorMessage);
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.setState({ driver: response.data.data }, () => {
        this.setState({ LoaderShow: false });
      });
    }
  };

  handleEditDriverModal = (name, email, phone, eid, Did) => {
    this.setState(
      {
        EditName: name,
        Editemail: email,
        Editphone: phone,
        EId: eid,
        Did: Did,
      },
      () => {
        this.setState({ EditDriverShow: true });
      }
    );
  };

  handleCloseEditDriverModal = () => {
    this.setState({ EditDriverShow: false }, () => {
      this.setState({
        EditName: null,
        Editemail: null,
        Editphone: null,
        EId: null,
        Did: null,
      });
    });
  };

  handleChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      }
    );
  };

  handleAddDriverModal = () => {
    this.setState({ driverShow: true }, () => {
      console.log(this.state.driverShow);
    });
  };

  handleCloseAddDriverModal = () => {
    this.setState({ driverShow: false });
  };

  handleEditDriver = async () => {
    const data = {
      isRestaurantDrivers: true,
      employeer_id: this.state.EId,
      user_id: this.state.Did,
      name: this.state.EditName,
      email: this.state.Editemail,
      phone: this.state.Editphone,
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
    const response = await instance
      .patch(requests.fetchEditDriverFromOwner, data, {
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
      this.getDriverOwner();
      this.handleCloseEditDriverModal();
      console.log(response.data);
    }
  };

  handleDeleteOwnerDriver = async (id) => {
    const response = await instance
      .delete(`${requests.fetchDeleteDriverFromOwner}${id}`, {
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
      this.getDriverOwner();
    }
  };

  componentDidMount = () => {
    this.getDriverOwner();
  };

  render() {
    const { driver } = this.state;

    return (
      <>
        {/* <Header /> */}
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <br />
              <br />
            </div>
          </Container>
        </div>
        <Container className="mt--7" fluid>
          <Loader open={this.state.LoaderShow} />
          <Row>
            <Col className="col">
              <Card className=" shadow">
                <CardHeader className="bg-transparent">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h1 className=" mb-0">{i18next.t("Owner Drivers")}</h1>
                    </div>

                    <div
                      className="col-4 text-right"
                      style={{ marginBottom: "auto", marginTop: "auto"}}
                    >
                      <Row className=" text-right" style={{float: "right"}}>
                        
                          <ExportCsv csvData={driver} fileName={"driver"} />
                        
                          <Button
                            size="sm"
                            color="danger"
                            type="button"
                            onClick={this.handleAddDriverModal}
                          >
                            {i18next.t("Add Driver")}
                          </Button>
                       
                      </Row>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
          </Row>
          <AddNewDriver
            show={this.state.driverShow}
            onClose={this.handleCloseAddDriverModal}
            getDriverOwner={this.getDriverOwner}
          />

          <Modal
            className="modal-dialog-centered"
            isOpen={this.state.EditDriverShow}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {i18next.t("Edit new Driver")}
              </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={this.handleCloseEditDriverModal}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modal-body p-0">
              <Card className="bg-secondary shadow border-0">
                <CardBody className="p-lg-5">
                  <FormGroup className="pb-3">
                    <Label for="EditName">{i18next.t("Name")}</Label>
                    <Input
                      className="px-2 py-4"
                      type="text"
                      placeholder={i18next.t("Driver Name")}
                      name="EditName"
                      value={this.state.EditName}
                      onChange={this.handleChange}
                    />
                  </FormGroup>

                  <FormGroup className="pb-3">
                    <Label for="Editemail">{i18next.t("Email")}</Label>
                    <Input
                      className="px-2 py-4"
                      type="email"
                      placeholder={i18next.t("Add Email Id")}
                      name="Editemail"
                      value={this.state.Editemail}
                      onChange={this.handleChange}
                    />
                  </FormGroup>

                  <FormGroup className="pb-3">
                    <Label for="Editphone">{i18next.t("Phone Number")}</Label>
                    {/* <Input
                      className="px-2 py-4"
                      type="number"
                      placeholder=" Add Phone Number"
                      name="Editphone"
                      value={this.state.Editphone}
                      onChange={this.handleChange}
                    /> */}
                    <PhoneInput
                      inputProps={{
                        name: "Editphone",
                        required: true,
                        autoFocus: true,
                      }}
                      inputStyle={{ width: "100%" }}
                      placeholder={i18next.t("Enter Phone no")}
                      country={"in"}
                      value={this.state.Editphone}
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
                      onClick={this.handleEditDriver}
                    >
                      {i18next.t("update")}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Modal>
          <Row>
            <div className="col">
              <Card>
                <CardHeader className="border-0">
                  <h3 className="mb-0">{i18next.t("Owner Driver Tables")}</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NAME</th>
                      <th scope="col">EMAIL</th>
                      <th scope="col">PHONE NUMBER</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.LoaderShow === false && driver.length > 0 ? (
                      <>
                        {driver.map((driver, index) => {
                          return (
                            <>
                              <tr>
                                <td>{driver.name}</td>
                                <td>{driver.email}</td>
                                <td>{driver.phone}</td>
                                <td>
                                  <Row>
                                    <Col>
                                      <Button
                                        className="mt-1 btn-md btn-block"
                                        color="success"
                                        type="button"
                                        size="sm"
                                        onClick={() => {
                                          this.handleEditDriverModal(
                                            driver.name,
                                            driver.email,
                                            driver.phone,
                                            driver.employeer_id,
                                            driver._id
                                          );
                                        }}
                                      >
                                        {i18next.t("Edit")}
                                      </Button>
                                    </Col>
                                    <Col>
                                      <Button
                                        className="mt-1 btn-md btn-block"
                                        color="danger"
                                        type="button"
                                        size="sm"
                                        onClick={() => {
                                          this.handleDeleteOwnerDriver(
                                            driver._id
                                          );
                                        }}
                                      >
                                        {i18next.t("Delete")}
                                      </Button>
                                    </Col>
                                  </Row>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </>
                    ) : (
                      <tr>
                        <td> Data Not Found ..! </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OwnerOrder);
