import React, { Component } from "react";
import HeaderFinance from "./HeaderFinance";

import i18next from "i18next";
// reactstrap components
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Button,
  CardBody,
  FormGroup,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Collapse,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardFooter,
  Badge,
} from "reactstrap";

import { Dropdown } from "semantic-ui-react";

import Moment from "react-moment";

// ReactDatetime
import ReactDatetime from "react-datetime";

import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";
import Loader from "../../common/Loader";
// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

let token = null;
let pageLinks = [];
let numberOfPages = 0;
let userData = {};

const mapStateToProps = (state) => {
  token = state.token;
  userData = state.userData;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientData: [],
      driversData: [],
      collapse: false,
      LoaderShow: true,
      dateFrom: "",
      dateTo: "",
      client: "",
      driver: "",
      currentPage: 1,
      total: 1,
      datas: [],
    };
  }

  handlePageNext = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 }, () => {
      this.getFinanceDetail();
    });
  };

  handlePagePrev = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 }, () => {
      this.getFinanceDetail();
    });
  };

  handlePageNum = (num) => {
    this.setState({ currentPage: num }, () => {
      this.getFinanceDetail();
    });
  };

  handleDateFromChange = (newDate) => {
    this.setState({
      dateFrom: newDate,
    });
  };
  handleDateToChange = (newDate) => {
    this.setState({
      dateTo: newDate,
    });
  };

  handleMovetoODetail = (O_id, index) => {
    this.props.ALL_ID({ O_id });
    const { history } = this.props;
    if (history) {
      history.push(`/orders/detail/${index}`);
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSelectChange = (e, data) => {
    this.setState({
      [data.name]: data.value,
    });
  };

  toggler = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  handleConnectToStripe = () => {
    
    //window.location = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_USER_KEY}&scope=read_write`;
    window.location = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_USER_KEY}&scope=read_write`;
  };

  handleDeactivateToStripe = async (id) => {
    const response = await instance
      .get(`${requests.fetchDeactiveStripeOAuth}?code=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error;
        console.log(errorMessage);
        //   NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.getFinanceDetail();
    }
  };

  getFinanceDetail = async () => {
    const data = {
      startDate: this.state.dateFrom,
      endDate: this.state.dateTo,
      client_id: this.state.client,
      driver_id: this.state.driver,
      items_in_page: 10,
      page_number: this.state.currentPage,
    };

    const response = await instance
      .post(requests.fetchFinanceOwner, data, {
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
      if (response.data.data.result.length > 0) {
        const cardData = [
          {
            cardTitle: i18next.t("ORDERS"),
            state_value:
              response.data.data.result[0].stats.length === 0
                ? 0
                : response.data.data.result[0].stats[0].hasOwnProperty(
                    "orders"
                  ) === true
                ? response.data.data.result[0].stats[0].orders
                : "",
          },
          {
            cardTitle: i18next.t("TOTAL"),
            state_value:
              response.data.data.result[0].stats.length === 0
                ? 0
                : response.data.data.result[0].stats[0].hasOwnProperty(
                    "total"
                  ) === true
                ? parseFloat(
                    response.data.data.result[0].stats[0].total.toFixed(2)
                  )
                : "",
          },
          {
            cardTitle: i18next.t("NET"),
            state_value:
              response.data.data.result[0].stats.length === 0
                ? 0
                : response.data.data.result[0].stats[0].hasOwnProperty(
                    "net_value"
                  ) === true
                ? parseFloat(
                    response.data.data.result[0].stats[0].net_value.toFixed(2)
                  )
                : "",
          },
          {
            cardTitle: i18next.t("DELIVERED"),
            state_value:
              response.data.data.result[0].stats.length === 0
                ? 0
                : response.data.data.result[0].stats[0].hasOwnProperty(
                    "deliveries"
                  ) === true
                ? response.data.data.result[0].stats[0].deliveries
                : "",
          },
          {
            cardTitle: i18next.t("VAT"),
            state_value:
              response.data.data.result[0].stats.length === 0
                ? 0
                : response.data.data.result[0].stats[0].hasOwnProperty(
                    "vat_value"
                  ) === true
                ? parseFloat(
                    response.data.data.result[0].stats[0].vat_value.toFixed(2)
                  )
                : "",
          },
        ];
        let ad = [];
        const CData =
          response.data.data.clients != null
            ? response.data.data.clients.map((Cd, i) => {
                const pf =
                  Cd.hasOwnProperty("profile_image") === true
                    ? `${Cd.profile_image.image_url}`
                    : "";
                ad[i] = {
                  value: Cd._id,
                  key: Cd.name,
                  text: Cd.name,
                  image: { avatar: true, src: pf },
                };
              })
            : [{ value: "", label: "", key: "", key: "" }];

        let bd = [];
        const DData =
          response.data.data.drivers != null
            ? response.data.data.drivers.map((Dd, i) => {
                const dpf =
                  Dd.hasOwnProperty("profile_image") === true
                    ? `${Dd.profile_image.image_url}`
                    : "";
                bd[i] = {
                  value: Dd._id,
                  key: Dd.name,
                  text: Dd.name,
                  image: { avatar: true, src: dpf },
                };
              })
            : [{ value: "", label: "", key: "", image: "" }];

        this.setState(
          {
            stateCard: cardData,

            clientData: ad,
            // response.data.data.clients != null
            //   ? response.data.data.clients
            //   : [{ _id: "", name: "" }],
            driversData: bd,
            stipe_acc_status: response.data.data.stipe_acc_status,
            user_acc:
              response.data.data.stipe_acc_status === true
                ? response.data.data.user_acc
                : "",
            currentPage: response.data.data.result[0].pageInfo.page_number,
            total: response.data.data.result[0].pageInfo.count,
            datas: response.data.data.result[0].docs,
          },
          () => {
            this.setState({ LoaderShow: false });
          }
        );
      } else {
        const cardData = [
          {
            cardTitle: i18next.t("ORDERS"),
            state_value: 0,
          },
          {
            cardTitle: i18next.t("TOTAL"),
            state_value: 0,
          },
          {
            cardTitle: i18next.t("NET"),
            state_value: 0,
          },
          {
            cardTitle: i18next.t("DELIVERED"),
            state_value: 0,
          },
          {
            cardTitle: i18next.t("VAT"),
            state_value: 0,
          },
        ];
        let ad = [];
        const CData =
          response.data.data.clients != null
            ? response.data.data.clients.map((Cd, i) => {
                const pf =
                  Cd.hasOwnProperty("profile_image") === true
                    ? `${Cd.profile_image.image_url}`
                    : "";
                ad[i] = {
                  value: Cd._id,
                  key: Cd.name,
                  text: Cd.name,
                  image: { avatar: true, src: pf },
                };
              })
            : [{ value: "", label: "", key: "", image: "" }];
        let bd = [];
        const DData =
          response.data.data.drivers != null
            ? response.data.data.drivers.map((Dd, i) => {
                const dpf =
                  Dd.hasOwnProperty("profile_image") === true
                    ? `${Dd.profile_image.image_url}`
                    : "";
                bd[i] = {
                  value: Dd._id,
                  key: Dd.name,
                  text: Dd.name,
                  image: { avatar: true, src: dpf },
                };
              })
            : [{ value: "", label: "", key: "", image: "" }];
        this.setState(
          {
            datas: response.data.data.result,
            stateCard: cardData,
            clientData: ad,
            stipe_acc_status: response.data.data.stipe_acc_status,
            user_acc:
              response.data.data.stipe_acc_status === true
                ? response.data.data.user_acc
                : "",
            driversData: bd,
          },
          () => {
            this.setState({ LoaderShow: false });
          }
        );
      }
    }
  };

  componentDidMount = () => {
    if (this.state.LoaderShow === true) {
      this.getFinanceDetail();
    }
  };

  render() {
    const { total, currentPage, user_acc, stipe_acc_status } = this.state;
    const date = new Date();
    let styleStripe = "mt--7";
    if (userData.country_code === "in") {
      styleStripe = "mt--9";
    } else {
      styleStripe = "mt--7";
    }
    pageLinks = [];
    numberOfPages = 0;
    if (this.state.total % 10 === 0) {
      numberOfPages = Math.floor(total / 10);
    } else {
      numberOfPages = Math.floor(total / 10) + 1;
    }
    for (let i = 1; i <= numberOfPages; i++) {
      pageLinks.push(i);
    }
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
        <Container className={styleStripe} fluid>
          <Loader open={this.state.LoaderShow} />
          <Row>
            {userData.country_code === "in" ? (
              ""
            ) : (
              <>
                <Col xs={12} sm="12 mb-4" xl={12}>
                  <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0">{i18next.t("Stripe connect")}</h3>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <div className="pl-lg-4 px-lg-4">
                        <p>
                          {i18next.t(
                            "We use Stripe to collect payments. Connect now, and we will send your funds from cart payments directly to Stripe account."
                          )}
                        </p>

                        {this.state.LoaderShow === false &&
                        stipe_acc_status === false ? (
                          <>
                            <hr className="my-4" />
                            <Button
                              color="primary"
                              type="button"
                              onClick={this.handleConnectToStripe}
                            >
                              {i18next.t("Connect With Stripe Account")}
                            </Button>
                          </>
                        ) : (
                          <>
                            <hr className="my-4" />
                            <Row>
                              <Col xs="12 my-3" sm="6" xl={6}>
                                <b>{i18next.t("Stripe account")}</b>
                                {"  "}
                                {this.state.LoaderShow === false &&
                                  user_acc.stripe_user_id}
                              </Col>
                              <Col xs="12 my-3" sm="6" xl={6}>
                                <b>{i18next.t("Stripe details")}</b>
                                {"  "}
                                {this.state.LoaderShow === false &&
                                user_acc.details_submitted === true
                                  ? i18next.t("Submited")
                                  : i18next.t("Not Submited")}
                              </Col>
                            </Row>
                            {this.state.LoaderShow === false &&
                            user_acc.details_submitted === true ? (
                              <>
                                <hr className="my-4" />
                                <Button
                                  color="danger"
                                  type="button"
                                  onClick={() => {
                                    this.handleDeactivateToStripe(
                                      user_acc.stripe_user_id
                                    );
                                  }}
                                >
                                  {i18next.t("Deactivate Stripe Account")}
                                </Button>
                              </>
                            ) : (
                              <>
                                <hr className="my-4" />
                                <Button
                                  color="primary"
                                  type="button"
                                  onClick={this.handleConnectToStripe}
                                >
                                  {i18next.t("Update to Stripe Account")}
                                </Button>
                                <Button
                                  color="danger"
                                  type="button"
                                  onClick={() => {
                                    this.handleDeactivateToStripe(
                                      user_acc.stripe_user_id
                                    );
                                  }}
                                >
                                  {i18next.t("Deactivate Stripe Account")}
                                </Button>
                              </>
                            )}
                          </>
                        )}

                        {/* <hr className="my-4" />
                    <Button
                      color="primary"
                      type="button"
                      onClick={this.handleTest}
                    >
                      Connect With Stripe Connect
                    </Button> */}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </>
            )}
          </Row>
          {this.state.LoaderShow === false && (
            <HeaderFinance states={this.state.stateCard} />
          )}

          {/* table */}
          <Row>
            <Col xs={12} sm="12 mb-4">
              <Card className="shadow">
                <CardHeader className="bg-white border-0">
                  <div className="collapse-class">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h3 className="mb-0">{i18next.t("ORDERS")}</h3>
                      </Col>
                      <Col className="text-right">
                        <Button
                          color="secondary"
                          outline
                          onClick={this.toggler}
                          style={{ marginBottom: "1rem", border: "none" }}
                        >
                          {this.state.collapse ? (
                            <span className="btn-inner--icon">
                              <i
                                id="button-filters"
                                className="ni ni-bold-up"
                              ></i>
                            </span>
                          ) : (
                            <span className="btn-inner--icon">
                              <i
                                id="button-filters"
                                className="ni ni-bold-down"
                              ></i>
                            </span>
                          )}
                        </Button>
                      </Col>
                    </Row>
                    <Collapse isOpen={this.state.collapse}>
                      <div>
                        <Row>
                          {/* Filter by Date From */}
                          <Col sm={6} xs={12}>
                            <FormGroup>
                              <Row>
                                <Col md={12} lg={12} xs={12}>
                                  <Label for="DateFrom">
                                    {" "}
                                    {i18next.t("Filter by Date From")}{" "}
                                  </Label>
                                </Col>
                                <Col md={12} lg={12} xs={12}>
                                  <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText>
                                        <i className="ni ni-calendar-grid-58" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <ReactDatetime
                                      onChange={this.handleDateFromChange}
                                      value={this.state.dateFrom}
                                      timeFormat={false}
                                      inputProps={{
                                        placeholder: i18next.t("Date From"),
                                      }}
                                    />
                                  </InputGroup>
                                </Col>
                              </Row>
                            </FormGroup>
                          </Col>
                          {/* To */}
                          <Col sm={6} xs={12}>
                            <FormGroup>
                              <Row>
                                <Col md={12} lg={12} xs={12}>
                                  <Label for="DateTo">{i18next.t("to")}</Label>
                                </Col>
                                <Col md={12} lg={12} xs={12}>
                                  <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText>
                                        <i className="ni ni-calendar-grid-58" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <ReactDatetime
                                      onChange={this.handleDateToChange}
                                      value={this.state.dateTo}
                                      inputProps={{
                                        placeholder: i18next.t("Date To"),
                                      }}
                                      timeFormat={false}
                                    />
                                  </InputGroup>
                                </Col>
                              </Row>
                            </FormGroup>
                          </Col>
                          {/* Filter by Client */}
                          <Col sm={6} xs={12}>
                            <FormGroup>
                              <Row>
                                <Col md={12} lg={12} xs={12}>
                                  <Label for="client">
                                    {i18next.t("Filter by Client")}
                                  </Label>
                                </Col>
                                <Col>
                                  <Dropdown
                                    placeholder={i18next.t("Select Client")}
                                    fluid
                                    search
                                    selection
                                    clearable
                                    name="client"
                                    options={this.state.clientData}
                                    onChange={this.handleSelectChange}
                                    // name="client"
                                  />
                                  {/* <Input
                                  
                                    type="select"
                                    name="client"
                                    id="client"
                                    onChange={this.handleChange}
                                    value={this.state.client}
                                  >
                                    <option value="" selected>
                                      --- Select ---
                                    </option>
                                    {this.state.clientData.map((data, i) => {
                                      return (
                                        <option value={data._id}>
                                          {data.name}
                                        </option>
                                      );
                                    })}
                                  </Input> */}
                                </Col>
                              </Row>
                            </FormGroup>
                          </Col>
                          {/* FILTER BY DRIVER */}
                          <Col sm={6} xs={12}>
                            <FormGroup>
                              <Row>
                                <Col md={12} lg={12} xs={12}>
                                  <Label for="driver">
                                    {i18next.t("Filter by Driver")}
                                  </Label>
                                </Col>
                                <Col>
                                  <Dropdown
                                    placeholder={i18next.t("Select Driver")}
                                    fluid
                                    search
                                    selection
                                    clearable
                                    name="driver"
                                    options={this.state.driversData}
                                    onChange={this.handleSelectChange}
                                    // name="client"
                                  />
                                  {/* <Input
                                    type="select"
                                    name="driver"
                                    id="driver"
                                    onChange={this.handleChange}
                                    value={this.state.client}
                                  >
                                    <option value="" selected>
                                      --- Select ---
                                    </option>
                                    {this.state.driversData.map((data, i) => {
                                      return (
                                        <option value={data._id}>
                                          {data.name}
                                        </option>
                                      );
                                    })}
                                  </Input> */}
                                </Col>
                              </Row>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="d-flex justify-content-end mr-2">
                          <Button
                            color="primary"
                            type="button"
                            onClick={this.getFinanceDetail}
                          >
                            {i18next.t("Filter")}
                          </Button>
                        </Row>
                      </div>
                    </Collapse>
                  </div>
                </CardHeader>
                <Table className="align-items-center" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">CREATED</th>
                      <th scope="col">TIMESLOT</th>
                      <th scope="col">METHOD</th>
                      <th scope="col">LAST STATUS</th>
                      <th scope="col">CLIENT</th>
                      <th scope="col">ITEMS</th>
                      <th scope="col">DRIVER</th>
                      <th scope="col">PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.datas.length > 0 ? (
                      this.state.datas.map((item, index) => (
                        <tr scope="row">
                          <td>
                            <Badge
                              color="success"
                              href=""
                              onClick={() => {
                                this.handleMovetoODetail(item._id, index);
                              }}
                            >
                              {item.o_id}
                            </Badge>
                          </td>
                          <td>
                            <Moment format="Do MMM YYYY, hh:mm">
                              {item.createdAt}
                            </Moment>
                          </td>
                          <td>{item.time_slot}</td>
                          {item.is_delivery ? (
                            <td class="table-web">
                              <span class="badge badge-primary badge-pill">
                                {i18next.t("Delivery")}
                              </span>
                            </td>
                          ) : (
                            <td class="table-web">
                              <span class="badge badge-success badge-pill">
                                {i18next.t("Pickup")}
                              </span>
                            </td>
                          )}
                          <td>{item.last_status}</td>
                          <td>{item.client_name.name}</td>
                          <td>{item.items}</td>
                          {item.driver_id ? (
                            <td>{item.driver_name.name}</td>
                          ) : (
                            <td></td>
                          )}
                          <td>{item.total}</td>
                          {/* <td>{item.delivery_charge}</td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td> {i18next.t("Data Not Found ..!")} </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                {this.state.total > 1 ? (
                  <CardFooter className="py-4">
                    <nav aria-label="...">
                      <Pagination
                        className="pagination justify-content-end mb-0"
                        listClassName="justify-content-end mb-0"
                      >
                        <PaginationItem
                          disabled={this.state.currentPage === 1 ? true : false}
                        >
                          <PaginationLink
                            onClick={this.handlePagePrev}
                            tabIndex="-1"
                          >
                            <i className="fas fa-angle-left" />
                            <span className="sr-only">{i18next.t("Previous")}</span>
                          </PaginationLink>
                        </PaginationItem>

                        {pageLinks.map((num) => {
                          return (
                            <PaginationItem
                              active={this.state.currentPage === num}
                            >
                              <PaginationLink
                                onClick={() => {
                                  this.handlePageNum(num);
                                }}
                              >
                                {num}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        <PaginationItem
                          disabled={
                            numberOfPages - this.state.currentPage === 0
                              ? true
                              : false
                          }
                        >
                          <PaginationLink onClick={this.handlePageNext}>
                            <i className="fas fa-angle-right" />
                            <span className="sr-only">{i18next.t("Next")}</span>
                          </PaginationLink>
                        </PaginationItem>
                      </Pagination>
                    </nav>
                  </CardFooter>
                ) : (
                  ""
                )}
              </Card>
            </Col>
          </Row>
          <NotificationContainer />
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Finance);
